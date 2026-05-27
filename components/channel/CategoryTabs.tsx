import { useLiveTVStore } from "@/store/useLiveTVStore";
import { channels } from "@/data/channels";

// Extract unique categories, adding 'All' and 'Favorites'
const getCategories = () => {
  const cats = Array.from(new Set(channels.map((c) => c.category)));
  return ["All", "Favorites", ...cats];
};

export function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useLiveTVStore();
  const categories = getCategories();

  return (
    <div className="no-scrollbar flex w-full overflow-x-auto border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur-md sticky top-16 z-20">
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-red-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
