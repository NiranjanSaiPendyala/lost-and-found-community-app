import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ItemCard } from "./ItemCard";

interface ItemListProps {
  type?: "lost" | "found";
  searchQuery?: string;
  category?: string;
}

export function ItemList({ type, searchQuery, category }: ItemListProps) {
  const items = useQuery(
    searchQuery
      ? api.items.search
      : api.items.list,
    searchQuery
      ? { query: searchQuery, type, category }
      : { type, category }
  );

  if (items === undefined) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">
          {searchQuery
            ? "Try adjusting your search terms"
            : "Be the first to post an item!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
}
