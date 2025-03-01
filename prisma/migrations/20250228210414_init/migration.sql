-- CreateEnum
CREATE TYPE "STORE_CATEGORY" AS ENUM ('SUSHI', 'UNAGI', 'TEMPURA', 'TONKATSU', 'YAKITORI', 'SUKIYAKI', 'SOBA', 'RAMEN', 'YAKISOBA', 'OKONOMIYAKI', 'DONBURI', 'ODEN', 'KAISEKI', 'HAMBAGU', 'TEPPANYAKI', 'CURRY', 'YAKINIKU', 'NABE', 'CAFE', 'IZAKAYA', 'OTHER');

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postalCode" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0.0,
    "reviewCount" INTEGER DEFAULT 0,
    "rating_count" "STORE_CATEGORY" NOT NULL,
    "images" TEXT[],
    "price_ranger" TEXT NOT NULL,
    "featured" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);
