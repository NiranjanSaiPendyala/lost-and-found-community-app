import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import { ItemList } from "./components/ItemList";
import { ItemForm } from "./components/ItemForm";
import { SearchBar } from "./components/SearchBar";
import { UserDashboard } from "./components/UserDashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<"browse" | "post" | "dashboard">("browse");
  const [itemType, setItemType] = useState<"lost" | "found" | "all">("all");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Lost & Found</h1>
              <Authenticated>
                <nav className="flex gap-2">
                  <button
                    onClick={() => setCurrentView("browse")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === "browse"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Browse
                  </button>
                  <button
                    onClick={() => setCurrentView("post")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === "post"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Post Item
                  </button>
                  <button
                    onClick={() => setCurrentView("dashboard")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === "dashboard"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    My Items
                  </button>
                </nav>
              </Authenticated>
            </div>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Unauthenticated>
          <div className="max-w-md mx-auto mt-16 p-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Community Lost & Found
              </h2>
              <p className="text-gray-600">
                Help reunite people with their lost belongings. Sign in to get started.
              </p>
            </div>
            <SignInForm />
          </div>
        </Unauthenticated>

        <Authenticated>
          <div className="max-w-6xl mx-auto px-4 py-6">
            {currentView === "browse" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setItemType("all")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        itemType === "all"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => setItemType("lost")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        itemType === "lost"
                          ? "bg-red-600 text-white"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      Lost Items
                    </button>
                    <button
                      onClick={() => setItemType("found")}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        itemType === "found"
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      Found Items
                    </button>
                  </div>
                  <SearchBar />
                </div>
                <ItemList type={itemType === "all" ? undefined : itemType} />
              </div>
            )}

            {currentView === "post" && <ItemForm />}
            {currentView === "dashboard" && <UserDashboard />}
          </div>
        </Authenticated>
      </main>
      <Toaster />
    </div>
  );
}
