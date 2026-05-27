import { Home, Tv, Heart } from "lucide-react";
import { useLiveTVStore } from "@/store/useLiveTVStore";

export function BottomNav() {
  const { activeCategory, setActiveCategory } = useLiveTVStore();

  const navItems = [
    { name: "Home", icon: Home, category: "All" },
    { name: "Live", icon: Tv, category: "News" }, // Example mapped category for quick access
    { name: "Favorites", icon: Heart, category: "Favorites" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-zinc-800 bg-zinc-950/90 pb-safe pt-2 backdrop-blur-lg md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeCategory === item.category;

        return (
          <button
            key={item.name}
            onClick={() => setActiveCategory(item.category)}
            className={`flex flex-col items-center justify-center p-2 transition-colors ${
              isActive ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon size={24} className={isActive ? "animate-pulse" : ""} />
            <span className="mt-1 text-[10px] font-medium">{item.name}</span>
          </button>
        );
      })}
    </div>
  );
}
