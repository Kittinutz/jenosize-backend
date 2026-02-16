/*
  Warnings:

  - Made the column `marketPlaceProductId` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_marketPlaceProductId_fkey";

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "marketPlaceProductId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
