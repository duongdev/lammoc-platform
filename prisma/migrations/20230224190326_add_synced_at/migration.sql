/*
  Warnings:

  - Added the required column `sycnedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sycnedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sycnedAt` to the `OrderLineItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sycnedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sycnedAt` to the `ProductBrand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sycnedAt` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sycnedAt` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrderLineItem" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductBrand" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductCategory" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "sycnedAt" TIMESTAMP(3) NOT NULL;
