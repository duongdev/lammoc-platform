-- CreateTable
CREATE TABLE "LoyaltyTier" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criteria" TEXT NOT NULL,
    "minCondition" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "maxDiscountAmount" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "totalMembers" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "LoyaltyTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyMember" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "nextCondition" TEXT,
    "nextTierRemainingMoney" DOUBLE PRECISION,
    "nextTierRemainingPoints" DOUBLE PRECISION,
    "lastActivityAt" TIMESTAMP(3),
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "usedPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "expireDate" TIMESTAMP(3),
    "totalSpent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastOrderAt" TIMESTAMP(3),
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalUncompletedOrders" INTEGER NOT NULL DEFAULT 0,
    "tierSpentPeriod" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customerId" TEXT NOT NULL,
    "loyaltyTierId" TEXT NOT NULL,
    "nextLoyaltyTierId" TEXT,

    CONSTRAINT "LoyaltyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyPointEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "activity" TEXT NOT NULL,
    "adjustPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "code" TEXT NOT NULL,
    "orderCode" TEXT,
    "returnPoint" BOOLEAN NOT NULL DEFAULT false,
    "loyaltyMemberId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "LoyaltyPointEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoyaltyMember_customerId_key" ON "LoyaltyMember"("customerId");

-- AddForeignKey
ALTER TABLE "LoyaltyMember" ADD CONSTRAINT "LoyaltyMember_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyMember" ADD CONSTRAINT "LoyaltyMember_loyaltyTierId_fkey" FOREIGN KEY ("loyaltyTierId") REFERENCES "LoyaltyTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyMember" ADD CONSTRAINT "LoyaltyMember_nextLoyaltyTierId_fkey" FOREIGN KEY ("nextLoyaltyTierId") REFERENCES "LoyaltyTier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyPointEvent" ADD CONSTRAINT "LoyaltyPointEvent_loyaltyMemberId_fkey" FOREIGN KEY ("loyaltyMemberId") REFERENCES "LoyaltyMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyPointEvent" ADD CONSTRAINT "LoyaltyPointEvent_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoyaltyPointEvent" ADD CONSTRAINT "LoyaltyPointEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
