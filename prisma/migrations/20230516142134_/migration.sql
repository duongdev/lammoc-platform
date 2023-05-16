-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "customerProfileId" TEXT;

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "facebook" TEXT,
    "job" TEXT,
    "gender" "Gender" NOT NULL DEFAULT 'Male'
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_phone_key" ON "CustomerProfile"("phone");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_customerProfileId_fkey" FOREIGN KEY ("customerProfileId") REFERENCES "CustomerProfile"("phone") ON DELETE SET NULL ON UPDATE CASCADE;
