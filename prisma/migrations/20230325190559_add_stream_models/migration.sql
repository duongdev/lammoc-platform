-- CreateTable
CREATE TABLE "StreamSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "embedCode" TEXT,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "StreamSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamProduct" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quantity" INTEGER,
    "accountId" TEXT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "streamSessionId" TEXT NOT NULL,

    CONSTRAINT "StreamProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamCart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "streamSessionId" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "StreamCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StreamCartItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "streamSessionId" TEXT NOT NULL,
    "streamCartId" TEXT NOT NULL,

    CONSTRAINT "StreamCartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StreamSession" ADD CONSTRAINT "StreamSession_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamProduct" ADD CONSTRAINT "StreamProduct_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamProduct" ADD CONSTRAINT "StreamProduct_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamProduct" ADD CONSTRAINT "StreamProduct_streamSessionId_fkey" FOREIGN KEY ("streamSessionId") REFERENCES "StreamSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamCart" ADD CONSTRAINT "StreamCart_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamCart" ADD CONSTRAINT "StreamCart_streamSessionId_fkey" FOREIGN KEY ("streamSessionId") REFERENCES "StreamSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamCart" ADD CONSTRAINT "StreamCart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamCartItem" ADD CONSTRAINT "StreamCartItem_streamSessionId_fkey" FOREIGN KEY ("streamSessionId") REFERENCES "StreamSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StreamCartItem" ADD CONSTRAINT "StreamCartItem_streamCartId_fkey" FOREIGN KEY ("streamCartId") REFERENCES "StreamCart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
