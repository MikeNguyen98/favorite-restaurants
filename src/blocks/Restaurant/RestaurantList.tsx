"use client";

import { HeartIcon, SearchIcon, StarIcon, StarIcon2 } from "@/components/Icon";
import { trpc } from "@/lib/trpc";
import { STORE_CATEGORY, textByStoreCategory } from "@/types/categoryType";
import { cn } from "@/utils";
import { PAGE_SIZE } from "@/utils/constants";
import { isEmpty, uniqBy } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDebounce } from "use-debounce";

const RestaurantList = () => {
  const [selectedCategory, setSelectedCategory] = useState<STORE_CATEGORY>(
    STORE_CATEGORY.ALL
  );
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const favoriteRestaurantMutation = trpc.favoriteRestaurant.useMutation();

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    trpc.getRestaurants.useInfiniteQuery(
      {
        limit: PAGE_SIZE,
        category:
          selectedCategory !== STORE_CATEGORY.ALL
            ? selectedCategory
            : null,
        keyword: debouncedSearchQuery,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      }
    );

  // Handle category change
  const handleCategoryChange = (category: STORE_CATEGORY) => {
    setSelectedCategory(category);
    // setRestaurants([]);
  };

  useEffect(() => {
    if (data?.pages) {
      setRestaurants((prev: Restaurant[]) => {
        // If we're on page 1, replace entirely rather than append
        if (data.pages.length === 1) {
          return data.pages[0].restaurants;
        }
        // Otherwise append unique restaurants
        return uniqBy(
          [...prev, ...data.pages.flatMap((page: any) => page.restaurants)],
          "id"
        );
      });
    }
  }, [data]);

  // Better intersection observer implementation
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
    // Add navigation implementation here
  };
  const toggleFavorite = async (data: Restaurant, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      // Optimistically update UI
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.id === data.id ? { ...r, isFavorite: !r.isFavorite } : r
        )
      );

      await favoriteRestaurantMutation.mutateAsync({
        id: data.id,
        isFavorite: !data.isFavorite, // Toggle the state
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert UI change if the mutation fails
      setRestaurants((prevRestaurants) =>
        prevRestaurants.map((r) =>
          r.id === data.id ? { ...r, isFavorite: data.isFavorite } : r
        )
      );
    }
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const r = restaurants[index];
    if (!r) return null;

    return (
      <div
        key={r.id}
        style={style}
        className="p-3 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
        onClick={() => handleRestaurantClick(r.id)}
      >
        <div className="flex flex-col gap-[12px]">
          <div className="relative w-full h-[200px] mr-4 flex-shrink-0">
            <Swiper
              pagination={true}
              modules={[Pagination]}
              className="h-full w-full"
            >
              {!isEmpty(r.images) ? (
                r.images.map((img: string, index: number) => (
                  <SwiperSlide key={`${img}-${index}`}>
                    <Image
                      src={img}
                      alt={r.name || "Restaurant image"}
                      fill
                      className="rounded-lg sm:rounded-2xl object-cover"
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div className="w-full h-full bg-gray-200 rounded-lg sm:rounded-2xl flex items-center justify-center">
                    <span className="text-gray-400 text-sm sm:text-base">
                      No Image
                    </span>
                  </div>
                </SwiperSlide>
              )}
            </Swiper>
            <button
              onClick={(e) => toggleFavorite(r, e)}
              className={cn(
                "p-[8px] absolute top-2 right-2 z-50 rounded-full",
                r.isFavorite
                  ? "bg-[#FF692E]"
                  : "shadow-lg bg-white bg-opacity-50"
              )}
            >
              <HeartIcon />
            </button>
          </div>

          <div className="flex gap-1 flex-col">
            <div className="flex justify-between items-center">
              {!isEmpty(r.featured) && (
                <span className="inline-flex text-[#FF692E] text-xs font-semibold gap-1 items-center truncate">
                  <StarIcon2 stroke="#FF692E" />{" "}
                  <span className="text-xs truncate">{r.featured.text}</span>
                </span>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div className="max-w-[80%]">
                <h2 className="text-sm sm:text-base font-semibold line-clamp-1">
                  {r.name}
                </h2>
              </div>
              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">
                    <StarIcon />
                  </span>
                  <span className="font-medium">{r.rating || "-"}</span>
                  <span className="text-gray-400 ml-1">
                    {r.rating ? `(${r.rating_count || 0})` : "(No ratings)"}
                  </span>
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
              {r.desc}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Search Bar */}
        <div className="p-3 sm:p-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="맛집 이름을 검색해보세요"
              className="w-full p-2 sm:p-3 pl-8 sm:pl-10 text-sm border rounded-xl sm:rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-300 focus:outline-none transition"
            />
            <span className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon stroke="#98A2B3" className="w-[20px] h-[20px]" />
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 sm:gap-2 whitespace-nowrap pb-1">
            {Object.values(STORE_CATEGORY).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors border border-gray-200 ${
                  selectedCategory === category
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {textByStoreCategory[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="px-1 sm:px-2 pb-4 h-[calc(100vh-150px)] sm:h-[calc(100vh-180px)]">
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <span className="text-4xl sm:text-5xl mb-3 sm:mb-4">🍽️</span>
            <p className="text-sm sm:text-base">
              No restaurants found. Try another search.
            </p>
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={restaurants.length}
                itemSize={306}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        )}

        {/* Loading indicator and sentinel for infinite scrolling */}
        <div id="load-more-sentinel" className="h-10 w-full">
          {isFetchingNextPage && (
            <div className="flex justify-center py-3 sm:py-4">
              <div className="loader w-5 h-5 sm:w-6 sm:h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-xs sm:text-sm text-gray-600">
                Loading more...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
