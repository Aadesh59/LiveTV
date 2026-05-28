"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLiveTVStore } from "@/store/useLiveTVStore";
import { channels } from "@/data/channels";
import { Loader2 } from "lucide-react";

export function VideoPlayer() {
  const { currentChannel, playChannel } = useLiveTVStore();
  const [error, setError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNextChannel = useCallback(() => {
    if (!currentChannel) return;
    const currentIndex = channels.findIndex((c) => c.id === currentChannel.id);
    const nextIndex = (currentIndex + 1) % channels.length;
    playChannel(channels[nextIndex]);
    setError(false);
    setIsBuffering(true);
  }, [currentChannel, playChannel]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentChannel) return;

    setIsBuffering(true);
    setError(false);

    // Keep track of the active player instance for cleanup
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let activePlayer: any = null;
    let destroyed = false;

    const safeSetError = (value: boolean) => !destroyed && setError(value);
    const safeSetIsBuffering = (value: boolean) => !destroyed && setIsBuffering(value);

    const rawUrl = currentChannel.url;
    // Force proxy for HTTP URLs to prevent Mixed Content blocking on HTTPS deployments
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const needsProxy = rawUrl.startsWith("http://");
    const proxyUrl = needsProxy ? `/api/proxy/${rawUrl.substring(7)}` : rawUrl;

    const isRawStream = 
      rawUrl.includes("/play/") || 
      rawUrl.endsWith(".ts") || 
      (!rawUrl.includes(".m3u8") && !rawUrl.includes(".mpd") && !rawUrl.includes("manifest"));

    const setupNativeFallback = () => {
      if (destroyed) return;
      console.log("[Player] Using native video binding...");
      
      video.src = needsProxy ? proxyUrl : rawUrl;
      video.load();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => safeSetIsBuffering(false))
          .catch((e: unknown) => {
            if (destroyed) return;
            console.warn("[Player] Native proxied playback failed:", e);
            
            if (isHttps && needsProxy) {
              console.error("[Player] Cannot fallback to direct HTTP URL on HTTPS site (Mixed Content).");
              safeSetError(true);
              return;
            }

            console.log("[Player] Trying direct URL fallback...");
            video.src = rawUrl;
            video.load();
            const fallbackPromise = video.play();
            if (fallbackPromise && typeof fallbackPromise.then === "function") {
              fallbackPromise
                .then(() => safeSetIsBuffering(false))
                .catch((err: unknown) => {
                  console.error("[Player] All native playback attempts failed:", err);
                  safeSetError(true);
                });
            } else {
              safeSetIsBuffering(false);
            }
          });
      } else {
        safeSetIsBuffering(false);
      }
    };

    const initializeRawTsPlayer = async () => {
      try {
        const mpegtsModule = await import("mpegts.js");
        if (destroyed) return;
        
        const mpegts = mpegtsModule.default || mpegtsModule;

        if (mpegts.getFeatureList().mseLivePlayback) {
          console.log("[Player] Initializing mpegts.js for raw progressive TS stream...");
          const mpegtsPlayer = mpegts.createPlayer({
            type: 'mse',
            isLive: true,
            url: needsProxy ? proxyUrl : rawUrl,
          }, {
            enableWorker: true,
            lazyLoadMaxDuration: 3 * 60,
            seekType: 'range',
            liveBufferLatencyChasing: true,
            liveBufferLatencyMaxLatency: 3,
            liveBufferLatencyMinRemain: 1,
          });

          mpegtsPlayer.attachMediaElement(video);
          mpegtsPlayer.load();
          
          mpegtsPlayer.on(mpegts.Events.ERROR, (errorType, errorDetail, errorInfo) => {
            console.error("[Player] mpegts error:", errorType, errorDetail, errorInfo);
            if (!destroyed) {
              try { mpegtsPlayer.destroy(); } catch {}
              setupNativeFallback();
            }
          });

          const mpegtsPlayPromise = mpegtsPlayer.play();
          if (mpegtsPlayPromise && typeof mpegtsPlayPromise.then === "function") {
            mpegtsPlayPromise
              .then(() => safeSetIsBuffering(false))
              .catch((e: unknown) => console.warn("[Player] mpegts autoplay blocked:", e));
          } else {
            safeSetIsBuffering(false);
          }

          activePlayer = {
            destroy: () => mpegtsPlayer.destroy(),
          };
        } else {
          console.log("[Player] mpegts.js unsupported on this browser (e.g., iOS). Using native.");
          setupNativeFallback();
        }
      } catch (err) {
        console.error("[Player] Failed to load mpegts.js module:", err);
        setupNativeFallback();
      }
    };

    const initializeShakaPlayer = async () => {
      try {
        const shakaModule = await import("shaka-player");
        if (destroyed) return;

        const shaka = shakaModule.default || shakaModule;
        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
          console.error("[Player] Browser not supported by Shaka Player");
          setupNativeFallback();
          return;
        }

        const shakaPlayer = new shaka.Player(video);
        activePlayer = shakaPlayer;

        shakaPlayer.configure({
          manifest: {
            retryParameters: {
              maxAttempts: 2,
              baseDelay: 500,
              backoffFactor: 2,
              timeout: 5000,
            },
          },
          streaming: {
            bufferingGoal: 2,
            rebufferingGoal: 1,
            bufferBehind: 10,
            lowLatencyMode: true,
            retryParameters: {
              maxAttempts: 2,
              baseDelay: 500,
              backoffFactor: 2,
              timeout: 5000,
            },
          },
        });

        const detachAndFallback = () => {
          try {
            const detachRes = shakaPlayer.detach() as unknown;
            if (detachRes && typeof (detachRes as { then?: unknown }).then === "function") {
              (detachRes as Promise<void>).then(setupNativeFallback).catch(() => safeSetError(true));
            } else {
              setupNativeFallback();
            }
          } catch {
            safeSetError(true);
          }
        };

        shakaPlayer.addEventListener("error", (event: Event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const shakaEvent = event as unknown as { detail: any };
          console.error("[Player] Shaka Player error:", shakaEvent.detail);
          
          if (shakaEvent.detail?.severity === 2 && !destroyed) {
            console.log("[Player] Shaka critical error, detaching and trying fallback...");
            detachAndFallback();
          }
        });

        shakaPlayer.load(proxyUrl)
          .then(() => {
            if (destroyed) return;
            safeSetIsBuffering(false);
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch((e: unknown) => console.warn("[Player] Autoplay blocked:", e));
            }
          })
          .catch((firstError: unknown) => {
            if (destroyed) return;
            console.warn("[Player] Proxy stream failed:", firstError);

            if (isHttps && needsProxy) {
              console.error("[Player] Skipping direct HTTP fallback on HTTPS site.");
              detachAndFallback();
              return;
            }

            shakaPlayer.load(rawUrl)
              .then(() => {
                if (destroyed) return;
                safeSetIsBuffering(false);
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                  playPromise.catch(() => {});
                }
              })
              .catch((err: unknown) => {
                if (destroyed) return;
                console.error("[Player] Direct play also failed:", err);
                detachAndFallback();
              });
          });

      } catch (err) {
        console.error("[Player] Failed to load Shaka Player module:", err);
        setupNativeFallback();
      }
    };

    if (isRawStream) {
      console.log("[Player] Raw stream detected. Bypassing Shaka Player.");
      initializeRawTsPlayer();
    } else {
      console.log("[Player] Standard manifest detected. Using Shaka Player.");
      initializeShakaPlayer();
    }

    return () => {
      destroyed = true;
      if (activePlayer) {
        try {
          if (typeof activePlayer.destroy === "function") {
            activePlayer.destroy();
          } else if (typeof activePlayer.detach === "function") {
            const detachRes = activePlayer.detach() as unknown;
            if (detachRes && typeof (detachRes as { then?: unknown }).then === "function") {
              (detachRes as Promise<void>).then(() => activePlayer.destroy());
            } else {
              activePlayer.destroy();
            }
          }
        } catch (e: unknown) {
          console.warn("[Player] Teardown warning:", e);
        }
      }
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [currentChannel]);

  if (!currentChannel) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Loading / Buffering State */}
      {isBuffering && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-10 pointer-events-none">
          <Loader2 size={48} className="animate-spin text-red-600 mb-4" />
          <h2 className="text-xl font-bold text-white">
            Tuning to {currentChannel.name}...
          </h2>
          <p className="text-zinc-400 mt-2 text-sm">
            Buffering live stream, please wait…
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 z-20">
          <div className="rounded-full bg-red-600/20 p-4 mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Stream Unavailable
          </h2>
          <p className="text-zinc-400 mb-6 text-center max-w-md">
            The stream for {currentChannel.name} is currently offline or
            unplayable.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => playChannel(null)}
              className="rounded-lg bg-zinc-800 px-6 py-2 text-white hover:bg-zinc-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleNextChannel}
              className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-500 transition-colors"
            >
              Try Next Channel
            </button>
          </div>
        </div>
      )}

      {/* Native Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        controls
        autoPlay
        onPlaying={() => setIsBuffering(false)}
        onWaiting={() => setIsBuffering(true)}
      />

      {/* Close Button */}
      <button
        onClick={() => playChannel(null)}
        className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-red-600 transition-colors"
        title="Close Player"
      >
        ✕
      </button>
    </div>
  );
}
