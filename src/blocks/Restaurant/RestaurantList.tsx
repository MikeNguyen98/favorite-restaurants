"use client";

import { trpc } from "@/lib/trpc";
import { useRestaurantStore } from "@/stores/useRestaurantStore";
import { STORE_CATEGORY } from "@/types/categoryType";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import RestaurantItem from "./RestaurantItem";
import CategoryFilter from "./sections/CategoryFilter";
import EmptyState from "./sections/EmptyState";
import SearchBar from "./sections/SearchBar";
import { isEmpty } from "lodash";
import { PAGE_SIZE } from "@/utils/constants";
import Loading from "@/components/Loading/Loading";

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
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef(null);
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

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    // Reset the observer when filters change
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && data?.hasNextPage && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [data?.hasNextPage, isFetching]);

  // Reset pagination when filters or search changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, debouncedSearchQuery]);

  const handleCategoryChange = (category: STORE_CATEGORY) => {
    setSelectedCategory(category);
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
        isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loading stroke="#FF692E" />
          </div>
        ) : (
          <EmptyState />
        )
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

          {/* Loading indicator with transition */}
          <div
            ref={loaderRef}
            className={`py-4 text-center text-gray-500 text-sm transition-opacity duration-300 ease-in-out ${
              isFetching ? "opacity-100" : "opacity-0"
            } ${
              data?.hasNextPage || isFetching ? "h-12" : "h-0 overflow-hidden"
            }`}
          >
            {isFetching && (
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            )}
          </div>

          {/* End of results message */}
          {!data?.hasNextPage && restaurants.length > 0 && (
            <div className="py-4 text-center text-gray-500 text-sm transition-opacity duration-300 ease-in-out opacity-100">
              You have seen all restaurants
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;
