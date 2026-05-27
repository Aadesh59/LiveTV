"use client";

import { useMemo, useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { CategoryTabs } from "@/components/channel/CategoryTabs";
import { ChannelGrid } from "@/components/channel/ChannelGrid";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { channels } from "@/data/channels";
import { useLiveTVStore } from "@/store/useLiveTVStore";
import { Search, Clock } from "lucide-react";
import { ChannelCard } from "@/components/channel/ChannelCard";

export default function Home() {
  const { activeCategory, searchTerm, setSearchTerm, favorites, recentlyWatched, currentChannel } = useLiveTVStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredChannels = useMemo(() => {
    let result = channels;

    if (activeCategory === "Favorites") {
      result = channels.filter((c) => favorites.includes(c.id));
    } else if (activeCategory !== "All") {
      result = channels.filter((c) => c.category === activeCategory);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (c) => c.name.toLowerCase().includes(lowerTerm) || c.category.toLowerCase().includes(lowerTerm)
      );
    }

    return result;
  }, [activeCategory, searchTerm, favorites]);

  // Avoid hydration mismatch by not rendering main content until mounted
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-red-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 pb-20 md:pb-0">
      <Navbar />
      
      {/* Mobile Search */}
      <div className="px-4 py-3 md:hidden">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:border-red-500 focus:outline-none"
          />
        </div>
      </div>

      <CategoryTabs />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        
        {/* Recently Watched Row */}
        {recentlyWatched.length > 0 && activeCategory === "All" && !searchTerm && (
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Clock size={20} className="text-red-500" />
              <h2 className="text-xl font-bold text-white">Continue Watching</h2>
            </div>
            <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
              {recentlyWatched.map((channel) => (
                <div key={`recent-${channel.id}`} className="min-w-[200px] md:min-w-[240px]">
                  <ChannelCard channel={channel} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            {searchTerm 
              ? `Search Results for "${searchTerm}"` 
              : activeCategory === "Favorites" 
                ? "Your Favorite Channels" 
                : `${activeCategory} Channels`}
          </h2>
          <span className="text-sm text-zinc-500">{filteredChannels.length} channels</span>
        </div>

        <ChannelGrid channels={filteredChannels} />
      </main>

      <BottomNav />
      
      {currentChannel && <VideoPlayer />}
    </div>
  );
}
