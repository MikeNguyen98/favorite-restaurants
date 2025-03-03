import { create } from "zustand";
import { uniqBy } from "lodash";
import { STORE_CATEGORY } from "@/types/categoryType";
import { trpc } from "@/lib/trpc";

interface RestaurantState {
  restaurants: Restaurant[];
  selectedCategory: STORE_CATEGORY;
  searchQuery: string;

  // Actions
  setRestaurants: (restaurants: Restaurant[]) => void;
  appendRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedCategory: (category: STORE_CATEGORY) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (id: string) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  selectedCategory: STORE_CATEGORY.ALL,
  searchQuery: "",

  setRestaurants: (restaurants: Restaurant[]) => set({ restaurants }),

  appendRestaurants: (newRestaurants: Restaurant[]) =>
    set((state) => ({
      restaurants: uniqBy([...state.restaurants, ...newRestaurants], "id"),
    })),

  setSelectedCategory: (category: STORE_CATEGORY) =>
    set({ selectedCategory: category }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),

  toggleFavorite: (id: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ),
    })),
}));
