import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface ItemCardProps {
  item: {
    _id: Id<"items">;
    title: string;
    description: string;
    category: string;
    type: "lost" | "found";
    location: string;
    dateReported: number;
    dateLostFound?: number;
    contactInfo: string;
    status: "active" | "resolved" | "expired";
    userName: string;
    imageUrl?: string | null;
    tags?: string[];
  };
}

export function ItemCard({ item }: ItemCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const createMatch = useMutation(api.matches.createMatch);
  const potentialMatches = useQuery(api.matches.findPotentialMatches, { itemId: item._id });
  const matches = useQuery(api.matches.getMatchesForItem, { itemId: item._id });

  const handleCreateMatch = async (otherItemId: Id<"items">) => {
    try {
      const lostItemId = item.type === "lost" ? item._id : otherItemId;
      const foundItemId = item.type === "found" ? item._id : otherItemId;
      
      await createMatch({ lostItemId, foundItemId });
      toast.success("Match created! Both users will be notified.");
    } catch (error) {
      toast.error("Failed to create match");
    }
  };

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryEmoji(item.category)}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                item.type === "lost"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {item.type.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(item.dateReported)}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        
        <div className="space-y-1 text-xs text-gray-500 mb-3">
          <div>📍 {item.location}</div>
          <div>👤 {item.userName}</div>
          {item.dateLostFound && (
            <div>📅 {item.type === "lost" ? "Lost" : "Found"} on {formatDate(item.dateLostFound)}</div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </button>
          <button
            onClick={() => setShowMatches(!showMatches)}
            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition-colors"
          >
            Matches ({matches?.length || 0})
          </button>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Contact:</span> {item.contactInfo}
              </div>
              <div>
                <span className="font-medium">Category:</span> {item.category}
              </div>
              <div>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`capitalize ${
                    item.status === "active"
                      ? "text-green-600"
                      : item.status === "resolved"
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            {potentialMatches && potentialMatches.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-sm mb-2">Potential Matches:</h4>
                <div className="space-y-2">
                  {potentialMatches.slice(0, 3).map((match) => (
                    <div
                      key={match._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                    >
                      <div>
                        <div className="font-medium">{match.title}</div>
                        <div className="text-gray-600">{match.location}</div>
                      </div>
                      <button
                        onClick={() => handleCreateMatch(match._id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Match
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showMatches && matches && matches.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-sm mb-2">Current Matches:</h4>
            <div className="space-y-2">
              {matches.map((match) => (
                <div
                  key={match._id}
                  className="p-2 bg-gray-50 rounded text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{match.otherItem?.title}</div>
                      <div className="text-gray-600">{match.otherItem?.userName}</div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        match.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : match.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
