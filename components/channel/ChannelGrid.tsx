import { Channel } from "@/types";
import { ChannelCard } from "./ChannelCard";
import { Tv } from "lucide-react";

interface ChannelGridProps {
  channels: Channel[];
}

export function ChannelGrid({ channels }: ChannelGridProps) {
  if (channels.length === 0) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-zinc-500">
        <Tv size={48} className="mb-4 opacity-50" />
        <h2 className="text-xl font-medium text-zinc-300">No channels found</h2>
        <p className="mt-2 text-sm">Try adjusting your search or category filter</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
      {channels.map((channel) => (
        <ChannelCard key={channel.id} channel={channel} />
      ))}
    </div>
  );
}
