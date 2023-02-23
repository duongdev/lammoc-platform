/*
  Warnings:

  - The `phone` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "phone",
ADD COLUMN     "phone" TEXT[];

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");
