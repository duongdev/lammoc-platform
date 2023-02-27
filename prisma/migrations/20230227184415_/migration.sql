-- DropIndex
DROP INDEX "OrderLineItem_productId_productVariantId_idx";

-- AlterTable
ALTER TABLE "OrderLineItem" ALTER COLUMN "productId" DROP NOT NULL,
ALTER COLUMN "productVariantId" DROP NOT NULL;
