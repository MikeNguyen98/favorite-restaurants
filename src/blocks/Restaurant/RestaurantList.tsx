"use client";

import LoadingIndicator from "@/components/Loading/LoadingIndicator";
import { trpc } from "@/lib/trpc";
import { STORE_CATEGORY } from "@/types/categoryType";
import { cn } from "@/utils";
import { PAGE_SIZE } from "@/utils/constants";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import RestaurantItem from "./RestaurantItem";
import CategoryFilter from "./sections/CategoryFilter";
import EmptyState from "./sections/EmptyState";
import SearchBar from "./sections/SearchBar";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { useRestaurantStore } from "@/stores/useRestaurantStore";
const RestaurantList = () => {
  const {
    restaurants,
    selectedCategory,
    searchQuery,
    setRestaurants,
    setSelectedCategory,
    setSearchQuery,
    toggleFavorite,
  } = useRestaurantStore();

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [page, setPage] = useState(1);
  const favoriteRestaurantMutation = trpc.addFavorite.useMutation();
  const { data, isFetching } = trpc.getRestaurants.useQuery(
    {
      limit: PAGE_SIZE,
      category:
        selectedCategory !== STORE_CATEGORY.ALL ? selectedCategory : null,
      keyword: debouncedSearchQuery,
      page,
    },
    {
      keepPreviousData: true, // Prevent UI flickers when changing pages
      onSuccess: (newData: { restaurants: any; hasNextPage: boolean }) => {
        if (page === 1) {
          setRestaurants(newData.restaurants);
        } else {
          setRestaurants([...restaurants, ...newData.restaurants]);
        }
      },
    }
  );
  console.log("🚀 ~ RestaurantList ~ data:", data);

  const handleCategoryChange = (category: STORE_CATEGORY) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (data?.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const handleToggleFavorite = async (
    restaurant: Restaurant,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    try {
      toggleFavorite(restaurant.id);
      favoriteRestaurantMutation.mutate({
        id: restaurant.id,
        isFavorite: !restaurant.isFavorite,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toggleFavorite(restaurant.id); // Revert state on failure
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
        <CategoryFilter
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Restaurant List */}
      {isEmpty(restaurants) ? (
        <EmptyState />
      ) : (
        <div className="h-[calc(100dvh-180px)] sm:h-[calc(100dvh-216px)] overflow-y-auto">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
              onClick={() =>
                console.log(`Navigate to restaurant ${restaurant.id}`)
              }
            >
              <RestaurantItem
                restaurant={restaurant}
                toggleFavorite={handleToggleFavorite}
              />
            </div>
          ))}

          {/* Load More Button */}
          {data?.hasNextPage && (
            <button
              onClick={handleLoadMore}
              className="w-full py-3 mt-4 bg-gray-100 text-gray-800 rounded"
            >
              {isFetching ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
