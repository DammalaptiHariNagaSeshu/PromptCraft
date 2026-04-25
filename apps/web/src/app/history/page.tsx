"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  Trash2,
  Clock,
  Trash,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { useHistoryStore } from "@/stores/history-store";
import { useGenerationStore } from "@/stores/generation-store";

export default function HistoryPage() {
  const router = useRouter();
  const { items, searchQuery, setSearchQuery, toggleFavorite, removeItem, clearAll } =
    useHistoryStore();
  const { setPrompt } = useGenerationStore();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredItems = items.filter((item) => {
    if (showFavoritesOnly && !item.isFavorite) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.prompt.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const handleLoad = (prompt: string) => {
    setPrompt(prompt);
    router.push("/generate");
  };

  return (
    <>
      <Navbar />
      <CommandPalette />

      <main className="relative min-h-screen pt-24 pb-16 px-4">
        <div className="orb orb-indigo w-[300px] h-[300px] -top-10 left-20 opacity-10" />

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4">
              Prompt <span className="gradient-text">History</span>
            </h1>
            <p className="text-white/50">
              Browse and reuse your past generations. {items.length} items saved.
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10
                  text-sm text-white placeholder:text-white/30 focus:outline-none
                  focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                showFavoritesOnly
                  ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-300"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white/70"
              }`}
            >
              <Star className="h-4 w-4" />
              Favorites
            </button>
            {items.length > 0 && (
              <button
                onClick={() => {
                  if (confirmClear) {
                    clearAll();
                    setConfirmClear(false);
                  } else {
                    setConfirmClear(true);
                    setTimeout(() => setConfirmClear(false), 3000);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  confirmClear
                    ? "bg-red-500/20 border border-red-500/30 text-red-300"
                    : "bg-white/5 border border-white/10 text-white/50 hover:text-red-400"
                }`}
              >
                <Trash className="h-4 w-4" />
                {confirmClear ? "Confirm Clear" : "Clear All"}
              </button>
            )}
          </div>

          {/* History List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <Clock className="h-12 w-12 text-white/10 mb-4" />
                  <h3 className="text-lg font-semibold text-white/40 mb-2">
                    {searchQuery ? "No matching results" : "No history yet"}
                  </h3>
                  <p className="text-sm text-white/30">
                    {searchQuery
                      ? "Try a different search term"
                      : "Generate your first prompt to see it here"}
                  </p>
                </motion.div>
              ) : (
                filteredItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="group glass rounded-xl p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 line-clamp-2 mb-2">
                          {item.prompt}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300/70"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs text-white/20">
                            T: {item.temperature}
                          </span>
                          <span className="text-xs text-white/20">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.isFavorite
                              ? "text-yellow-400 bg-yellow-500/10"
                              : "text-white/30 hover:text-yellow-400 hover:bg-yellow-500/10"
                          }`}
                        >
                          <Star className="h-4 w-4" fill={item.isFavorite ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => handleLoad(item.prompt)}
                          className="p-2 rounded-lg text-white/30 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}
