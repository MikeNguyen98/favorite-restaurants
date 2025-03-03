import { z } from "zod";
import { publicProcedure, router } from "./context";
import { prisma } from "./db/prisma";

export const appRouter = router({
  getRestaurants: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        page: z.number().min(1).default(1), // Add page input
        category: z.string().nullish(),
        keyword: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const { limit, page, category, keyword } = input;
      const whereCondition: any = {};

      if (category) whereCondition.category = category;
      if (keyword?.trim()) {
        whereCondition.name = { contains: keyword, mode: "insensitive" };
      }

      const restaurants = await prisma.restaurant.findMany({
        take: limit,
        skip: (page - 1) * limit, // Use skip for pagination
        orderBy: { id: "asc" },
        where: whereCondition,
      });

      const totalCount = await prisma.restaurant.count({
        where: whereCondition,
      });
      const hasNextPage = page * limit < totalCount;

      return { restaurants, hasNextPage };
    }),
  addFavorite: publicProcedure
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
