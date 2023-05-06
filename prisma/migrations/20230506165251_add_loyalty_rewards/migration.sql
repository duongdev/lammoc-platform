/*
  Warnings:

  - The `description` column on the `LoyaltyTier` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LoyaltyTier" DROP COLUMN "description",
ADD COLUMN     "description" TEXT[];

-- CreateTable
CREATE TABLE "LoyaltyTierReward" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "name" TEXT NOT NULL,
    "point" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "loyaltyTierId" TEXT NOT NULL,

    CONSTRAINT "LoyaltyTierReward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoyaltyTierReward" ADD CONSTRAINT "LoyaltyTierReward_loyaltyTierId_fkey" FOREIGN KEY ("loyaltyTierId") REFERENCES "LoyaltyTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
