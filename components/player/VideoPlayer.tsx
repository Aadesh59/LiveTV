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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let playerInstance: any = null;
    let destroyed = false;

    import("shaka-player").then((shakaModule) => {
      if (destroyed) return;

      const shaka = shakaModule.default || shakaModule;
      shaka.polyfill.installAll();

      if (!shaka.Player.isBrowserSupported()) {
        console.error("Browser not supported by Shaka Player");
        setError(true);
        return;
      }

      const shakaPlayer = new shaka.Player(video);
      playerInstance = shakaPlayer;

      // Tuned for live HLS streams over a proxy/CDN
      shakaPlayer.configure({
        manifest: {
          retryParameters: {
            maxAttempts: 4,
            baseDelay: 500,
            backoffFactor: 1.5,
            timeout: 15000,
          },
        },
        streaming: {
          bufferingGoal: 20,          // Buffer 20s ahead before considering it "playing"
          rebufferingGoal: 5,         // Only re-buffer after 5s of empty buffer
          bufferBehind: 30,           // Keep 30s of past content in memory
          lowLatencyMode: false,      // Disable low-latency — it hurts buffering on proxied streams
          retryParameters: {
            maxAttempts: 4,
            baseDelay: 500,
            backoffFactor: 1.5,
            timeout: 15000,
          },
        },
      });

      shakaPlayer.addEventListener("error", (event: Event) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const shakaEvent = event as unknown as { detail: any };
        console.error("Shaka Player Internal Error:", shakaEvent.detail);
        // severity 2 = CRITICAL (playback cannot continue)
        if (shakaEvent.detail?.severity === 2) {
          setError(true);
        }
      });

      const rawUrl = currentChannel.url;
      const needsProxy = rawUrl.startsWith("http://");
      const proxyUrl = needsProxy
        ? `/api/proxy/${rawUrl.substring(7)}`
        : rawUrl;

      shakaPlayer
        .load(proxyUrl)
        .then(() => {
          if (destroyed) return;
          setIsBuffering(false);
          video.play().catch((e) => console.warn("Autoplay prevented:", e));
        })
        .catch((firstError: unknown) => {
          if (destroyed) return;
          console.warn("Proxy stream failed, trying direct URL:", firstError);

          // Fallback: attempt the raw URL directly (works if the stream
          // server allows cross-origin or the user is on the same network)
          if (needsProxy) {
            shakaPlayer
              .load(rawUrl)
              .then(() => {
                if (destroyed) return;
                setIsBuffering(false);
                video.play().catch(() => {});
              })
              .catch((fallbackError: unknown) => {
                if (destroyed) return;
                console.error("Direct fallback also failed:", fallbackError);
                setError(true);
              });
          } else {
            setError(true);
          }
        });
    });

    return () => {
      destroyed = true;
      if (playerInstance) {
        playerInstance
          .destroy()
          .catch((e: Error) => console.warn("Player teardown error:", e));
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
