/*
  Warnings:

  - You are about to drop the column `deliveryFee` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "deliveryFee",
ADD COLUMN     "orderDeliveryFeeId" TEXT;

-- CreateTable
CREATE TABLE "OrderDeliveryFee" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "shippingCostId" TEXT,
    "shippingCostName" TEXT,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "OrderDeliveryFee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderDeliveryFeeId_fkey" FOREIGN KEY ("orderDeliveryFeeId") REFERENCES "OrderDeliveryFee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
