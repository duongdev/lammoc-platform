/*
  Warnings:

  - You are about to drop the column `sycnedAt` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `sycnedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `sycnedAt` on the `OrderLineItem` table. All the data in the column will be lost.
  - You are about to drop the column `sycnedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sycnedAt` on the `ProductBrand` table. All the data in the column will be lost.
  - You are about to drop the column `sycnedAt` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the column `sycnedAt` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `syncedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncedAt` to the `OrderLineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncedAt` to the `ProductBrand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncedAt` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncedAt` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderLineItem" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductBrand" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "sycnedAt",
ADD COLUMN     "syncedAt" TIMESTAMP(3) NOT NULL;
