/*
  Warnings:

  - A unique constraint covering the columns `[normalizedName]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "normalizedName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_normalizedName_key" ON "Product"("normalizedName");
