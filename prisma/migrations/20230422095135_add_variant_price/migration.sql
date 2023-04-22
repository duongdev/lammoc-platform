-- CreateTable
CREATE TABLE "ProductVariantPrice" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "included_tax_price" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,

    CONSTRAINT "ProductVariantPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariantPriceList" (
    "id" TEXT NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isCost" BOOLEAN NOT NULL DEFAULT false,
    "currencyIso" TEXT NOT NULL,
    "currencySymbol" TEXT NOT NULL,

    CONSTRAINT "ProductVariantPriceList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductVariantPrice" ADD CONSTRAINT "ProductVariantPrice_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariantPrice" ADD CONSTRAINT "ProductVariantPrice_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "ProductVariantPriceList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
