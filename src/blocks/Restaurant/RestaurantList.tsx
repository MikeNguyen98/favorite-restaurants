"use client";

import { trpc } from "@/lib/trpc";
import { STORE_CATEGORY, textByStoreCategory } from "@/types/categoryType";
import { PAGE_SIZE } from "@/utils/constants";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const RestaurantList = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    STORE_CATEGORY | "전체"
  >("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    trpc.getRestaurants.useInfiniteQuery(
      {
        limit: PAGE_SIZE,
        category: selectedCategory !== "전체" ? selectedCategory : undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
      }
    );

  const restaurants = data?.pages.flatMap((page) => page.restaurants) || [];

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

  const toggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRestaurantClick = (id: string) => {
    console.log(`Navigate to restaurant details page for ID: ${id}`);
    // Add navigation implementation here
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
        className="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
        onClick={() => handleRestaurantClick(r.id)}
      >
        <div className="flex">
          <div className="relative w-32 h-32 mr-4 flex-shrink-0">
            {r.images && r.images[0] ? (
              <Image
                src={r.images[0]}
                alt={r.name}
                fill
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                {r.featured && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full mb-1 inline-block">
                    Featured
                  </span>
                )}
                <h2 className="text-lg font-semibold line-clamp-1">{r.name}</h2>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={(e) => toggleFavorite(r.id, e)}
                aria-label={
                  favorites[r.id] ? "Remove from favorites" : "Add to favorites"
                }
              >
                {favorites[r.id] ? (
                  <span className="text-red-500 text-xl">❤️</span>
                ) : (
                  <span className="text-gray-400 text-xl">🤍</span>
                )}
              </button>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{r.desc}</p>

            <div className="flex items-center text-gray-500 text-sm mt-2">
              <span className="flex items-center">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="font-medium">{r.rating || 0}</span>
                <span className="text-gray-400 ml-1">
                  {r.rating
                    ? `(${r.rating_count || 0} reviews)`
                    : "(No ratings yet)"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative mt-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="맛집 이름을 검색해보세요"
              className="w-full p-3 pl-10 border rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-300 focus:outline-none transition"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 whitespace-nowrap">
            <button
              onClick={() => setSelectedCategory("전체")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200 ${
                selectedCategory === "전체"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {Object.values(STORE_CATEGORY).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border border-gray-200 ${
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
      <div className="px-2 pb-4 h-[calc(100vh-180px)]">
        {restaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <span className="text-5xl mb-4">🍽️</span>
            <p>No restaurants found. Try another search.</p>
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={restaurants.length}
                itemSize={148}
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
            <div className="flex justify-center py-4">
              <div className="loader w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
