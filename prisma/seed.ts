import { PrismaClient, Prisma } from "@prisma/client";
import mockData from "./mockData.json";
const prisma = new PrismaClient();

const restaurantData: Prisma.RestaurantCreateInput[] = mockData

async function main() {
  console.log(`Start seeding ...`);
  for (const u of restaurantData) {
    const Restaurant = await prisma.restaurant.create({
      data: u,
    });
    console.log(`Created Restaurant with id: ${Restaurant.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
