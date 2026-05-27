import { Channel } from "@/types";
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, X, SkipBack, SkipForward } from "lucide-react";

interface PlayerControlsProps {
  channel: Channel;
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  volume: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFullscreenToggle: () => void;
  onClose: () => void;
  onNextChannel: () => void;
  onPrevChannel: () => void;
}

export function PlayerControls({
  channel,
  isPlaying,
  isMuted,
  isFullscreen,
  volume,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onFullscreenToggle,
  onClose,
  onNextChannel,
  onPrevChannel,
}: PlayerControlsProps) {
  return (
    <>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 transition-opacity duration-300">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900/50 backdrop-blur-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={channel.logo} alt={channel.name} className="h-8 w-8 object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white shadow-black drop-shadow-md">
              {channel.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE
              </span>
              <span className="text-xs text-zinc-300 shadow-black drop-shadow-md">
                {channel.category}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-red-600"
        >
          <X size={24} />
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 md:p-6 transition-opacity duration-300">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            {/* Left Controls */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={onPrevChannel}
                className="text-white hover:text-red-400 transition-colors"
                title="Previous Channel"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={onPlayPause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110 hover:bg-red-500"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>

              <button
                onClick={onNextChannel}
                className="text-white hover:text-red-400 transition-colors"
                title="Next Channel"
              >
                <SkipForward size={24} />
              </button>

              <div className="hidden md:flex items-center gap-2 group">
                <button
                  onClick={onMuteToggle}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={onVolumeChange}
                  className="w-0 opacity-0 group-hover:w-24 group-hover:opacity-100 transition-all duration-300 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={onFullscreenToggle}
                className="text-white hover:text-red-400 transition-colors"
              >
                {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
