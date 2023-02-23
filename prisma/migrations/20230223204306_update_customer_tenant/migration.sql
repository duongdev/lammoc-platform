/*
  Warnings:

  - You are about to drop the column `tenants` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `tenant` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_phone_key";

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "tenants",
ADD COLUMN     "tenant" "Tenant" NOT NULL;

-- CreateIndex
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");
