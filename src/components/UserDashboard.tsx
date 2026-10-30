import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function UserDashboard() {
  const userItems = useQuery(api.items.getUserItems);
  const updateItem = useMutation(api.items.update);
  const updateMatchStatus = useMutation(api.matches.updateMatchStatus);
  const [editingItem, setEditingItem] = useState<Id<"items"> | null>(null);

  const handleStatusUpdate = async (itemId: Id<"items">, status: "active" | "resolved" | "expired") => {
    try {
      await updateItem({ id: itemId, status });
      toast.success("Item status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleMatchUpdate = async (matchId: Id<"matches">, status: "confirmed" | "dismissed") => {
    try {
      await updateMatchStatus({ matchId, status });
      toast.success(`Match ${status}`);
    } catch (error) {
      toast.error("Failed to update match");
    }
  };

  if (userItems === undefined) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No items posted yet</h3>
        <p className="text-gray-600">Click "Post Item" to add your first lost or found item.</p>
      </div>
    );
  }

  const activeItems = userItems.filter(item => item.status === "active");
  const resolvedItems = userItems.filter(item => item.status === "resolved");
  const expiredItems = userItems.filter(item => item.status === "expired");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Items</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activeItems.length}</div>
            <div className="text-green-700">Active Items</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{resolvedItems.length}</div>
            <div className="text-blue-700">Resolved Items</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{expiredItems.length}</div>
            <div className="text-gray-700">Expired Items</div>
          </div>
        </div>
      </div>

      {activeItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeItems.map((item) => (
              <ItemDashboardCard
                key={item._id}
                item={item}
                onStatusUpdate={handleStatusUpdate}
                onMatchUpdate={handleMatchUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {resolvedItems.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Resolved Items</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resolvedItems.map((item) => (
              <ItemDashboardCard
                key={item._id}
                item={item}
                onStatusUpdate={handleStatusUpdate}
                onMatchUpdate={handleMatchUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ItemDashboardCardProps {
  item: any;
  onStatusUpdate: (itemId: Id<"items">, status: "active" | "resolved" | "expired") => void;
  onMatchUpdate: (matchId: Id<"matches">, status: "confirmed" | "dismissed") => void;
}

function ItemDashboardCard({ item, onStatusUpdate, onMatchUpdate }: ItemDashboardCardProps) {
  const matches = useQuery(api.matches.getMatchesForItem, { itemId: item._id });
  const [showMatches, setShowMatches] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      electronics: "📱",
      clothing: "👕",
      accessories: "👜",
      documents: "📄",
      keys: "🔑",
      other: "📦",
    };
    return emojis[category] || "📦";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{getCategoryEmoji(item.category)}</span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.type === "lost"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {item.type.toUpperCase()}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ml-auto ${
            item.status === "active"
              ? "bg-green-100 text-green-700"
              : item.status === "resolved"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {item.status.toUpperCase()}
        </span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
      <p className="text-xs text-gray-500 mb-3">📍 {item.location}</p>
      <p className="text-xs text-gray-500 mb-3">📅 {formatDate(item.dateReported)}</p>

      <div className="space-y-2">
        {item.status === "active" && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusUpdate(item._id, "resolved")}
              className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => onStatusUpdate(item._id, "expired")}
              className="flex-1 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
            >
              Mark Expired
            </button>
          </div>
        )}

        <button
          onClick={() => setShowMatches(!showMatches)}
          className="w-full px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200"
        >
          {showMatches ? "Hide" : "Show"} Matches ({matches?.length || 0})
        </button>

        {showMatches && matches && matches.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-200">
            {matches.map((match) => (
              <div key={match._id} className="p-2 bg-gray-50 rounded text-xs">
                <div className="font-medium">{match.otherItem?.title}</div>
                <div className="text-gray-600 mb-2">{match.otherItem?.userName}</div>
                <div className="flex gap-1">
                  {match.status === "pending" && (
                    <>
                      <button
                        onClick={() => onMatchUpdate(match._id, "confirmed")}
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => onMatchUpdate(match._id, "dismissed")}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {match.status !== "pending" && (
                    <span
                      className={`px-2 py-1 rounded ${
                        match.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {match.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
