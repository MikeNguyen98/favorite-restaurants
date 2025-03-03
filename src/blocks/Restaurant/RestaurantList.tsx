"use client";

import LoadingIndicator from "@/components/Loading/LoadingIndicator";
import { trpc } from "@/lib/trpc";
import { STORE_CATEGORY } from "@/types/categoryType";
import { cn } from "@/utils";
import { PAGE_SIZE } from "@/utils/constants";
import { isEmpty } from "lodash";
import { useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import RestaurantItem from "./RestaurantItem";
import CategoryFilter from "./sections/CategoryFilter";
import EmptyState from "./sections/EmptyState";
import SearchBar from "./sections/SearchBar";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { useRestaurantStore } from "@/stores/useRestaurantStore";

const RestaurantList = () => {
  // Use Zustand store instead of local state
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
  const favoriteRestaurantMutation = trpc.addFavorite.useMutation();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    trpc.getRestaurants.useInfiniteQuery(
      {
        limit: PAGE_SIZE,
        category:
          selectedCategory !== STORE_CATEGORY.ALL ? selectedCategory : null,
        keyword: debouncedSearchQuery,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      }
    );

  const handleCategoryChange = (category: STORE_CATEGORY) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    if (data?.pages) {
      if (data.pages.length === 1) {
        setRestaurants(data.pages[0].restaurants as any[]);
      } else {
        const allRestaurants = data.pages.flatMap(
          (page: any) => page.restaurants
        );
        setRestaurants(allRestaurants);
      }
    }
  }, [data, setRestaurants]);

  const setupIntersectionObserver = useCallback(() => {
    if (!hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    const sentinel = document.getElementById("load-more-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    return setupIntersectionObserver();
  }, [setupIntersectionObserver]);

  const handleRestaurantClick = (id: string) => {
    console.log(`Navigate to restaurant details page for ID: ${id}`);
  };

  // Modified to use the Zustand store action
  const handleToggleFavorite = async (
    restaurant: Restaurant,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    try {
      // Update state through Zustand
      toggleFavorite(restaurant.id);

      // Call API
      favoriteRestaurantMutation.mutate({
        id: restaurant.id,
        isFavorite: !restaurant.isFavorite,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert the toggle in case of error
      toggleFavorite(restaurant.id);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e)}
          onClear={() => setSearchQuery("")}
        />

        {/* Categories */}
        <CategoryFilter
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Restaurant List */}
      {isEmpty(restaurants) && <EmptyState />}
      <div
        className={cn(
          "h-[calc(100dvh-218px)]",
          isEmpty(restaurants) ? "hidden" : "flex"
        )}
      >
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={restaurants.length}
              itemSize={306}
              width={width}
            >
              {({ index, style }) => {
                const r = restaurants[index];
                if (!r) return null;
                return (
                  <div
                    key={r.id}
                    style={style}
                    className="p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
                    onClick={() => handleRestaurantClick(r.id)}
                  >
                    <RestaurantItem
                      restaurant={r}
                      toggleFavorite={handleToggleFavorite}
                    />
                  </div>
                );
              }}
            </List>
          )}
        </AutoSizer>
        {/* Loading indicator and sentinel for infinite scrolling */}
        <div id="load-more-sentinel" className="h-10 w-full">
          {isFetchingNextPage && <LoadingIndicator />}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
