import { Search, Tv } from "lucide-react";
import { useLiveTVStore } from "@/store/useLiveTVStore";

export function Navbar() {
  const { searchTerm, setSearchTerm } = useLiveTVStore();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-2 text-red-600">
        <Tv size={28} className="animate-pulse" />
        <h1 className="text-2xl font-black tracking-tight text-white">
          tedey<span className="text-red-600">TV</span>
        </h1>
      </div>

      <div className="relative hidden max-w-md flex-1 md:block md:mx-6">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div className="md:hidden">
        {/* Mobile search toggle could go here, or handled by BottomNav */}
      </div>
    </header>
  );
}
