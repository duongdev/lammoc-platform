-- CreateIndex
CREATE INDEX "OrderLineItem_productId_productVariantId_idx" ON "OrderLineItem"("productId", "productVariantId");
