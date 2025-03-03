import { HeartIcon, StarIcon, StarIcon2 } from "@/components/Icon";
import { cn } from "@/utils";
import { isEmpty } from "lodash";
import React, { useCallback } from "react";
import ImageSwiper from "./sections/ImageSwiper";

interface RestaurantItemProps {
  restaurant: Restaurant;
  toggleFavorite: (data: Restaurant, event: React.MouseEvent) => void;
}

const RestaurantItem: React.FC<RestaurantItemProps> = ({
  restaurant,
  toggleFavorite,
}) => {
  const handleFavoriteClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      toggleFavorite(restaurant, event);
    },
    [restaurant, toggleFavorite]
  );

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="relative w-full h-[200px] mr-4 flex-shrink-0 bg-white/25 backdrop-blur-md">
        <ImageSwiper images={restaurant.images} name={restaurant.name} />
        <button
          onClick={(e) => handleFavoriteClick(e)}
          className={cn(
            "p-[8px] absolute top-2 right-2 z-50 rounded-full",
            restaurant.isFavorite
              ? "bg-[#FF692E]"
              : "shadow-lg bg-white/25 backdrop-blur-md"
          )}
        >
          <HeartIcon />
        </button>
      </div>

      <div className="flex gap-1 flex-col">
        <div className="flex justify-between items-center">
          {!isEmpty(restaurant.featured) && (
            <span className="inline-flex text-[#FF692E] text-xs font-semibold gap-1 items-center truncate">
              <StarIcon2 stroke="#FF692E" />{" "}
              <span className="text-xs truncate">
                {restaurant.featured.text}
              </span>
            </span>
          )}
        </div>
        <div className="flex justify-between items-start">
          <div className="max-w-[80%]">
            <h2 className="text-sm sm:text-base font-semibold line-clamp-1 text-black">
              {restaurant.name}
            </h2>
          </div>
          <div className="flex items-center text-gray-500 text-xs sm:text-sm">
            <span className="flex items-center">
              <span className="text-yellow-400 mr-1">
                <StarIcon />
              </span>
              <span className="font-medium text-black">
                {restaurant.rating || "-"}
              </span>
              <span className="text-black">
                {restaurant.rating
                  ? `(${restaurant.rating_count || 0})`
                  : "(0)"}
              </span>
            </span>
          </div>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
          {restaurant.desc}
        </p>
      </div>
    </div>
  );
};

// Using React.memo with a custom comparison function for optimal performance
export default React.memo(RestaurantItem, (prevProps, nextProps) => {
  // Only re-render if the id changes or if isFavorite status changes
  return (
    prevProps.restaurant.id === nextProps.restaurant.id &&
    prevProps.restaurant.isFavorite === nextProps.restaurant.isFavorite
  );
});
