import { create } from "zustand";
import { uniqBy } from "lodash";
import { STORE_CATEGORY } from "@/types/categoryType";

interface RestaurantState {
  restaurants: Restaurant[];
  selectedCategory: STORE_CATEGORY;
  searchQuery: string;
  page: number;

  // Actions
  setRestaurants: (restaurants: Restaurant[], reset?: boolean) => void;
  appendRestaurants: (restaurants: Restaurant[]) => void;
  setSelectedCategory: (category: STORE_CATEGORY) => void;
  setSearchQuery: (query: string) => void;
  nextPage: () => void;
  resetPagination: () => void;
  toggleFavorite: (id: string) => void;
}

export const useRestaurantStore = create<RestaurantState>((set) => ({
  restaurants: [],
  selectedCategory: STORE_CATEGORY.ALL,
  searchQuery: "",
  page: 1,

  setRestaurants: (restaurants: Restaurant[], reset = false) =>
    set((state) => ({
      restaurants: reset
        ? restaurants
        : uniqBy([...state.restaurants, ...restaurants], "id"),
    })),

  appendRestaurants: (newRestaurants: Restaurant[]) =>
    set((state) => ({
      restaurants: uniqBy([...state.restaurants, ...newRestaurants], "id"),
    })),

  setSelectedCategory: (category: STORE_CATEGORY) =>
    set({ selectedCategory: category, restaurants: [], page: 1 }),

  setSearchQuery: (query: string) =>
    set({ searchQuery: query, restaurants: [], page: 1 }),

  nextPage: () => set((state) => ({ page: state.page + 1 })),

  resetPagination: () => set({ page: 1, restaurants: [] }),

  toggleFavorite: (id: string) =>
    set((state) => ({
      restaurants: state.restaurants.map((r) =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r
      ),
    })),
}));
