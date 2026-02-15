/*
  Warnings:

  - You are about to drop the `LazadaProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShopeeProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PlatformEnum" AS ENUM ('LAZADA', 'SHOPEE');

-- DropForeignKey
ALTER TABLE "LazadaProduct" DROP CONSTRAINT "LazadaProduct_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopeeProduct" DROP CONSTRAINT "ShopeeProduct_productId_fkey";

-- DropTable
DROP TABLE "LazadaProduct";

-- DropTable
DROP TABLE "ShopeeProduct";

-- CreateTable
CREATE TABLE "MarketPlaceProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "platform" "PlatformEnum" NOT NULL,
    "productId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketPlaceProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketPlaceProduct_productId_key" ON "MarketPlaceProduct"("productId");

-- AddForeignKey
ALTER TABLE "MarketPlaceProduct" ADD CONSTRAINT "MarketPlaceProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
