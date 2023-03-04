/*
  Warnings:

  - The `minCondition` column on the `LoyaltyTier` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "LoyaltyTier" DROP COLUMN "minCondition",
ADD COLUMN     "minCondition" DOUBLE PRECISION NOT NULL DEFAULT 0;
