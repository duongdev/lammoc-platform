/*
  Warnings:

  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDiscount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Order_code_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "channel" TEXT,
ADD COLUMN     "deliveryFee" DOUBLE PRECISION,
ADD COLUMN     "discountReason" TEXT,
ADD COLUMN     "einvoiceStatus" TEXT,
ADD COLUMN     "fulfillmentStatus" TEXT,
ADD COLUMN     "issuedAt" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "packedStatus" TEXT,
ADD COLUMN     "paymentStatus" TEXT,
ADD COLUMN     "receivedStatus" TEXT,
ADD COLUMN     "returnStatus" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalDiscount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalTax" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "OrderLineItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "taxRate" DOUBLE PRECISION,
    "taxAmount" DOUBLE PRECISION,
    "discountValue" DOUBLE PRECISION,
    "discountReason" TEXT,
    "discountAmount" DOUBLE PRECISION,
    "note" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION,
    "lineAmount" DOUBLE PRECISION,
    "distributedDiscountAmount" DOUBLE PRECISION,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,

    CONSTRAINT "OrderLineItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
