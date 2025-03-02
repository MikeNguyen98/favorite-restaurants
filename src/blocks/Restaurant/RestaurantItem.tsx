// components/RestaurantItem.tsx
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { HeartIcon, StarIcon, StarIcon2 } from "@/components/Icon";
import { cn } from "@/utils";
import { isEmpty } from "lodash";
import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

interface RestaurantItemProps {
  restaurants: Restaurant[];
  onClick: (id: string) => void;
  toggleFavorite: (data: Restaurant, event: React.MouseEvent) => void;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({
  restaurants,
  onClick,
  toggleFavorite,
}) => {
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
        onClick={() => onClick(r.id)}
      >
        <div className="flex flex-col gap-[12px]">
          <div className="relative w-full h-[200px] mr-4 flex-shrink-0 bg-white/25 backdrop-blur-md">
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
                      onError={(e) => {
                        e.currentTarget.src = "/assets/fallbackImage.png";
                        e.currentTarget.srcset = "/assets/fallbackImage.png";
                        e.currentTarget.onerror = null;
                      }}
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
                  : "shadow-lg bg-white/25 backdrop-blur-md"
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
                <h2 className="text-sm sm:text-base font-semibold line-clamp-1 text-black">
                  {r.name}
                </h2>
              </div>
              <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                <span className="flex items-center">
                  <span className="text-yellow-400 mr-1">
                    <StarIcon />
                  </span>
                  <span className="font-medium text-black">
                    {r.rating || "-"}
                  </span>
                  <span className="text-black">
                    {r.rating ? `(${r.rating_count || 0})` : "(0)"}
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
  );
};

export default React.memo(RestaurantItem);
