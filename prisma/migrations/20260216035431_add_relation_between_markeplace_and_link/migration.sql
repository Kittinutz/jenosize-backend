-- CreateTable
CREATE TABLE "MarketPlaceProductsLinks" (
    "id" TEXT NOT NULL,
    "marketPlaceProductId" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketPlaceProductsLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarketPlaceProductsLinks_linkId_key" ON "MarketPlaceProductsLinks"("linkId");

-- AddForeignKey
ALTER TABLE "MarketPlaceProductsLinks" ADD CONSTRAINT "MarketPlaceProductsLinks_marketPlaceProductId_fkey" FOREIGN KEY ("marketPlaceProductId") REFERENCES "MarketPlaceProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPlaceProductsLinks" ADD CONSTRAINT "MarketPlaceProductsLinks_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
