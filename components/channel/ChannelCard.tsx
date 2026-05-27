import { Channel } from "@/types";
import { useLiveTVStore } from "@/store/useLiveTVStore";
import { Play, Heart } from "lucide-react";
import Image from "next/image";

interface ChannelCardProps {
  channel: Channel;
}

export function ChannelCard({ channel }: ChannelCardProps) {
  const { playChannel, toggleFavorite, favorites } = useLiveTVStore();
  const isFavorite = favorites.includes(channel.id);

  return (
    <div
      onClick={() => playChannel(channel)}
      className="group relative cursor-pointer overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 transition-all hover:scale-105 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10"
    >
      {/* Thumbnail Aspect Ratio */}
      <div className="relative aspect-video w-full bg-black/40">
        <Image
          src={channel.logo}
          alt={channel.name}
          fill
          className="object-contain p-4 opacity-80 transition-opacity group-hover:opacity-100"
          unoptimized
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white">
            LIVE
          </span>
          {channel.isHD && (
            <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
              HD
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(channel.id);
          }}
          className="absolute top-2 right-2 rounded-full bg-black/40 p-1.5 text-zinc-400 backdrop-blur-md transition-colors hover:text-white"
        >
          <Heart
            size={16}
            className={isFavorite ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        {/* Play Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-red-600 p-3 text-white shadow-lg">
            <Play size={20} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="line-clamp-1 font-semibold text-zinc-100 group-hover:text-red-400 transition-colors">
          {channel.name}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">{channel.category}</p>
      </div>
    </div>
  );
}
