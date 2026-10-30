import { useState } from "react";
import { ItemList } from "./ItemList";

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search items by description..."
          className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          {isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>
      
      {isSearching && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Search Results for "{searchQuery}"
          </h3>
          <ItemList searchQuery={searchQuery} />
        </div>
      )}
    </div>
  );
}
