/*
  Warnings:

  - You are about to drop the column `included_tax_price` on the `ProductVariantPrice` table. All the data in the column will be lost.
  - Added the required column `includedTaxPrice` to the `ProductVariantPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariantPrice" DROP COLUMN "included_tax_price",
ADD COLUMN     "includedTaxPrice" DOUBLE PRECISION NOT NULL;
