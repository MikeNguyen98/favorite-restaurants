/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RestaurantList from "@/blocks/Restaurant/RestaurantList";

const RestaurantsPage = () => {
  return (
    <div className="p-6">
      <div className="flex flex-col">
        <RestaurantList />
      </div>
    </div>
  );
};

export default RestaurantsPage;
