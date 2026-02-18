-- DropForeignKey
ALTER TABLE "CampaignsProducts" DROP CONSTRAINT "CampaignsProducts_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "CampaignsProducts" DROP CONSTRAINT "CampaignsProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_marketPlaceProductId_fkey";

-- DropForeignKey
ALTER TABLE "MarketPlaceProduct" DROP CONSTRAINT "MarketPlaceProduct_productId_fkey";

-- AddForeignKey
ALTER TABLE "MarketPlaceProduct" ADD CONSTRAINT "MarketPlaceProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignsProducts" ADD CONSTRAINT "CampaignsProducts_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignsProducts" ADD CONSTRAINT "CampaignsProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
