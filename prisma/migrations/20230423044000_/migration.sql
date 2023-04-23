/*
  Warnings:

  - Added the required column `tenant` to the `ProductVariantPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariantPrice" ADD COLUMN     "tenant" "Tenant" NOT NULL;
