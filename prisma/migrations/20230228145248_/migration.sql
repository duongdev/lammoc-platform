/*
  Warnings:

  - You are about to drop the column `referenceStatusExplaination` on the `OrderFulfillmentShipment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderFulfillmentShipment" DROP COLUMN "referenceStatusExplaination",
ADD COLUMN     "referenceStatusExplanation" TEXT;
