import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { HistoryItem } from "@promptcraft/types";

interface HistoryState {
  items: HistoryItem[];
  searchQuery: string;
  sidebarOpen: boolean;

  addItem: (item: HistoryItem) => void;
  removeItem: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSidebarOpen: (open: boolean) => void;
  clearAll: () => void;
  getFilteredItems: () => HistoryItem[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      searchQuery: "",
      sidebarOpen: false,

      addItem: (item) =>
        set((state) => {
          const items = [item, ...state.items].slice(0, 50); // Keep 50 max
          return { items };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
          ),
        })),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      clearAll: () => set({ items: [] }),

      getFilteredItems: () => {
        const { items, searchQuery } = get();
        if (!searchQuery) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(
          (item) =>
            item.prompt.toLowerCase().includes(q) ||
            item.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      },
    }),
    {
      name: "promptcraft-history",
    }
  )
);
