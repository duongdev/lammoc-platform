/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_phone_key" ON "Account"("phone");
