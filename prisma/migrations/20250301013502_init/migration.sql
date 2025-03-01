/*
  Warnings:

  - You are about to drop the column `address` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `price_ranger` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Restaurant` table. All the data in the column will be lost.
  - The `rating_count` column on the `Restaurant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `category` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_range` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "address",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "phone",
DROP COLUMN "postalCode",
DROP COLUMN "price_ranger",
DROP COLUMN "reviewCount",
DROP COLUMN "state",
DROP COLUMN "website",
ADD COLUMN     "category" "STORE_CATEGORY" NOT NULL,
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price_range" TEXT NOT NULL,
DROP COLUMN "rating_count",
ADD COLUMN     "rating_count" INTEGER NOT NULL DEFAULT 0;
