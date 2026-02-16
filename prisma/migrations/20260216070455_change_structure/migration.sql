/*
  Warnings:

  - You are about to drop the `CampaignProductsLinks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarketPlaceProductsLinks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `campaingId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CampaignProductsLinks" DROP CONSTRAINT "CampaignProductsLinks_campaignProductsId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignProductsLinks" DROP CONSTRAINT "CampaignProductsLinks_linkId_fkey";

-- DropForeignKey
ALTER TABLE "MarketPlaceProductsLinks" DROP CONSTRAINT "MarketPlaceProductsLinks_linkId_fkey";

-- DropForeignKey
ALTER TABLE "MarketPlaceProductsLinks" DROP CONSTRAINT "MarketPlaceProductsLinks_marketPlaceProductId_fkey";

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "campaingId" TEXT NOT NULL,
ADD COLUMN     "marketPlaceProductId" TEXT;

-- DropTable
DROP TABLE "CampaignProductsLinks";

-- DropTable
DROP TABLE "MarketPlaceProductsLinks";

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_campaingId_fkey" FOREIGN KEY ("campaingId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProduct"("id") ON DELETE SET NULL ON UPDATE CASCADE;
