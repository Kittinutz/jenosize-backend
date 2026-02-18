-- CreateTable
CREATE TABLE "ClickEvent" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "marketPlaceProductId" TEXT NOT NULL,
    "productId" TEXT,
    "platform" "PlatformEnum" NOT NULL,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClickEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClickEvent_campaignId_clickedAt_idx" ON "ClickEvent"("campaignId", "clickedAt");

-- CreateIndex
CREATE INDEX "ClickEvent_productId_clickedAt_idx" ON "ClickEvent"("productId", "clickedAt");

-- CreateIndex
CREATE INDEX "ClickEvent_platform_clickedAt_idx" ON "ClickEvent"("platform", "clickedAt");

-- CreateIndex
CREATE INDEX "ClickEvent_urlId_clickedAt_idx" ON "ClickEvent"("urlId", "clickedAt");

-- CreateIndex
CREATE INDEX "ClickEvent_clickedAt_idx" ON "ClickEvent"("clickedAt");

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClickEvent" ADD CONSTRAINT "ClickEvent_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
