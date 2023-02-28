-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "completedOn" TIMESTAMP(3),
ADD COLUMN     "createInvoice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "finalizedOn" TIMESTAMP(3),
ADD COLUMN     "finishedOn" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "OrderFulfillment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "stockLocationId" TEXT,
    "code" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "partnerId" TEXT,
    "shippingAddress" TEXT,
    "deliveryType" TEXT NOT NULL,
    "discountRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "discountAmout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL,
    "totalTax" DOUBLE PRECISION NOT NULL,
    "totalDiscount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "packedOn" TIMESTAMP(3),
    "receivedOn" TIMESTAMP(3),
    "shippedOn" TIMESTAMP(3),
    "cancelDate" TIMESTAMP(3),
    "status" TEXT,
    "paymentStatus" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "orderFulfillmentShipmentId" TEXT,

    CONSTRAINT "OrderFulfillment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderFulfillmentShipment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "deliveryServiceProviderId" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "codAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "freightAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trackingCode" TEXT,
    "trackingUrl" TEXT,
    "detail" TEXT,
    "note" TEXT,
    "pushingStatus" TEXT,
    "referenceStatus" TEXT,
    "referenceStatusExplaination" TEXT,
    "pushingNote" TEXT,
    "collationStatus" TEXT,
    "partnerOrderId" TEXT,
    "freightPayer" TEXT,
    "estimatedDeliveryTime" TIMESTAMP(3),
    "sortingCode" TEXT,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "length" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "height" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "width" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "shippingAddressId" TEXT,

    CONSTRAINT "OrderFulfillmentShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingAddress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "label" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "address1" TEXT,
    "address2" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "country" TEXT,
    "city" TEXT,
    "district" TEXT,
    "ward" TEXT,
    "zipCode" TEXT,
    "fullAddress" TEXT,

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderFulfillment" ADD CONSTRAINT "OrderFulfillment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFulfillment" ADD CONSTRAINT "OrderFulfillment_orderFulfillmentShipmentId_fkey" FOREIGN KEY ("orderFulfillmentShipmentId") REFERENCES "OrderFulfillmentShipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderFulfillmentShipment" ADD CONSTRAINT "OrderFulfillmentShipment_shippingAddressId_fkey" FOREIGN KEY ("shippingAddressId") REFERENCES "ShippingAddress"("id") ON DELETE SET NULL ON UPDATE CASCADE;
