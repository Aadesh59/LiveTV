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

  // Shaka Player Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentChannel) return;

    setIsBuffering(true);
    let player: { destroy: () => Promise<void> } | null = null;

    // Import shaka dynamically to prevent SSR errors (navigator is not defined)
    import("shaka-player").then((shakaModule) => {
      const shaka = shakaModule.default || shakaModule;

      shaka.polyfill.installAll();

      if (shaka.Player.isBrowserSupported()) {
        const shakaPlayer = new shaka.Player(video);
        player = shakaPlayer;

        shakaPlayer.addEventListener("error", (event: Event) => {
          const shakaEvent = event as unknown as { detail: unknown };
          console.error("Shaka Player Error", shakaEvent.detail);
          setError(true);
        });

        let loadUrl = currentChannel.url;
        if (loadUrl.startsWith("http://")) {
          loadUrl = `/api/proxy/${loadUrl.substring(7)}`;
        }

        shakaPlayer
          .load(loadUrl)
          .then(() => {
            setIsBuffering(false);
            video.play().catch((e) => console.error("Autoplay prevented:", e));
          })
          .catch((e) => {
            console.error("Error loading video", e);
            setError(true);
          });
      } else {
        console.error("Browser not supported by Shaka Player");
        setError(true);
      }
    });

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [currentChannel]);

  if (!currentChannel) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {/* Loading/Buffering State */}
      {isBuffering && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-10 pointer-events-none">
          <Loader2 size={48} className="animate-spin text-red-600 mb-4" />
          <h2 className="text-xl font-bold text-white">
            Tuning to {currentChannel.name}...
          </h2>
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

      {/* Simple Close Button floating above the native player */}
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
