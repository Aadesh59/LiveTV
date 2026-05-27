import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Channel } from '@/types';

interface LiveTVState {
  currentChannel: Channel | null;
  favorites: string[];
  recentlyWatched: Channel[];
  searchTerm: string;
  activeCategory: string;

  // Actions
  playChannel: (channel: Channel | null) => void;
  toggleFavorite: (channelId: string) => void;
  addToRecent: (channel: Channel) => void;
  setSearchTerm: (term: string) => void;
  setActiveCategory: (category: string) => void;
}

export const useLiveTVStore = create<LiveTVState>()(
  persist(
    (set) => ({
      currentChannel: null,
      favorites: [],
      recentlyWatched: [],
      searchTerm: '',
      activeCategory: 'All',

      playChannel: (channel) => {
        set({ currentChannel: channel });
        if (channel) {
          set((state) => {
            // Remove if already in recent to avoid duplicates
            const filteredRecent = state.recentlyWatched.filter((c) => c.id !== channel.id);
            // Add to front and limit to 10
            return {
              recentlyWatched: [channel, ...filteredRecent].slice(0, 10),
            };
          });
        }
      },

      toggleFavorite: (channelId) =>
        set((state) => {
          const isFav = state.favorites.includes(channelId);
          return {
            favorites: isFav
              ? state.favorites.filter((id) => id !== channelId)
              : [...state.favorites, channelId],
          };
        }),

      addToRecent: (channel) =>
        set((state) => {
          const filteredRecent = state.recentlyWatched.filter((c) => c.id !== channel.id);
          return {
            recentlyWatched: [channel, ...filteredRecent].slice(0, 10),
          };
        }),

      setSearchTerm: (term) => set({ searchTerm: term }),

      setActiveCategory: (category) => set({ activeCategory: category }),
    }),
    {
      name: 'livetv-storage',
      // Only persist favorites and recently watched
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyWatched: state.recentlyWatched,
      }),
    }
  )
);
