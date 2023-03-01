-- CreateTable
CREATE TABLE "DeliveryServiceProvider" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "groupName" TEXT,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "shipmentCount" INTEGER NOT NULL DEFAULT 0,
    "totalFreightAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fulfillmentProcessingCount" INTEGER NOT NULL DEFAULT 0,
    "freightPayer" TEXT,

    CONSTRAINT "DeliveryServiceProvider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderFulfillmentShipment" ADD CONSTRAINT "OrderFulfillmentShipment_deliveryServiceProviderId_fkey" FOREIGN KEY ("deliveryServiceProviderId") REFERENCES "DeliveryServiceProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
