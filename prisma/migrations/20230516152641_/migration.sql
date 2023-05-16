/*
  Warnings:

  - You are about to drop the column `phone` on the `CustomerProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `CustomerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_customerProfileId_fkey";

-- DropIndex
DROP INDEX "CustomerProfile_phone_key";

-- AlterTable
ALTER TABLE "CustomerProfile" DROP COLUMN "phone";

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_id_key" ON "CustomerProfile"("id");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
