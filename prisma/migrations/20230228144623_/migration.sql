/*
  Warnings:

  - You are about to drop the column `discountAmout` on the `OrderFulfillment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderFulfillment" DROP COLUMN "discountAmout",
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
