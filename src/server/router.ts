import { z } from "zod";
import { publicProcedure, router } from "./context";
import { prisma } from "./db/prisma";

export const appRouter = router({
  getRestaurants: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().nullish(), // cursor for pagination
        category: z.string().nullish(), // filter by category
        keyword: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor, category, keyword } = input;
      const whereCondition: any = {};

      // Add category filter if provided
      if (category) {
        whereCondition.category = category;
      }
      // Add search filter if provided
      if (keyword && keyword.trim() !== "") {
        whereCondition.name = {
          contains: keyword,
          mode: "insensitive",
        };
      }
      const restaurants = await prisma.restaurant.findMany({
        take: limit + 1, // Fetch extra item to check if there's a next page
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { id: "asc" },
        where: whereCondition,
      });

      let nextCursor: string | undefined = undefined;
      if (restaurants.length > limit) {
        const nextItem = restaurants.pop(); // Remove extra item and use its ID as cursor
        nextCursor = nextItem?.id;
      }

      return {
        restaurants,
        nextCursor,
      };
    }),
  favoriteRestaurant: publicProcedure
    .input(
      z.object({
        id: z.string(),
        isFavorite: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, isFavorite } = input;

      const updatedRestaurant = await prisma.restaurant.update({
        where: { id },
        data: { isFavorite },
      });

      return updatedRestaurant;
    }),
});

export type AppRouter = typeof appRouter;
