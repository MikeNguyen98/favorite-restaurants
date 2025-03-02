"use client";

import { trpc } from "@/lib/trpc";
import { STORE_CATEGORY } from "@/types/categoryType";
import { PAGE_SIZE } from "@/utils/constants";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import RestaurantItem from "./RestaurantItem";
import CategoryFilter from "./sections/CategoryFilter";
import EmptyState from "./sections/EmptyState";
import SearchBar from "./sections/SearchBar";
import LoadingIndicator from "@/components/Loading/LoadingIndicator";

const RestaurantList = () => {
  const [selectedCategory, setSelectedCategory] = useState<STORE_CATEGORY>(
    STORE_CATEGORY.ALL
  );
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      setRestaurants((prev: Restaurant[]) => {
        if (data.pages.length === 1) {
          return data.pages[0].restaurants;
        }
        return uniqBy(
          [...prev, ...data.pages.flatMap((page: any) => page.restaurants)],
          "id"
        );
      });
    }
  }, [data]);

  useEffect(() => {
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

  const handleRestaurantClick = (id: string) => {
    console.log(`Navigate to restaurant details page for ID: ${id}`);
  };
  const toggleFavorite = async (data: Restaurant, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.id === data.id ? { ...r, isFavorite: !r.isFavorite } : r
        )
      );

      await favoriteRestaurantMutation.mutateAsync({
        id: data.id,
        isFavorite: !data.isFavorite,
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.id === data.id ? { ...r, isFavorite: data.isFavorite } : r
        )
      );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e)} />

        {/* Categories */}
        <CategoryFilter
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      {/* Restaurant List */}
      <div className="px-1 sm:px-2 pb-4 h-dvh sm:h-[calc(100dvh-200px)]">
        {restaurants.length === 0 ? (
          <EmptyState />
        ) : (
          <RestaurantItem restaurants={restaurants} onClick={handleRestaurantClick} toggleFavorite={toggleFavorite}/>
        )}

        {/* Loading indicator and sentinel for infinite scrolling */}
        <div id="load-more-sentinel" className="h-10 w-full">
          {isFetchingNextPage && <LoadingIndicator />}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
