/*
  Warnings:

  - You are about to drop the column `customerId` on the `LoyaltyPointEvent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoyaltyPointEvent" DROP CONSTRAINT "LoyaltyPointEvent_customerId_fkey";

-- AlterTable
ALTER TABLE "LoyaltyPointEvent" DROP COLUMN "customerId";
