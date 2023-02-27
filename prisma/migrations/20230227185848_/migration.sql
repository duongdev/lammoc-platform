/*
  Warnings:

  - Made the column `productId` on table `OrderLineItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productVariantId` on table `OrderLineItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderId` on table `OrderLineItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OrderLineItem" ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "productVariantId" SET NOT NULL,
ALTER COLUMN "orderId" SET NOT NULL;
