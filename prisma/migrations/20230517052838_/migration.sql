/*
  Warnings:

  - You are about to drop the column `customerProfileId` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `phone` to the `CustomerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_customerProfileId_fkey";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "customerProfileId";

-- AlterTable
ALTER TABLE "CustomerProfile" ADD COLUMN     "phone" TEXT NOT NULL;
