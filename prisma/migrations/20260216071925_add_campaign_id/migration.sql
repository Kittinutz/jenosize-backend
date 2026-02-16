/*
  Warnings:

  - You are about to drop the column `campaingId` on the `Link` table. All the data in the column will be lost.
  - Added the required column `campaignId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_campaingId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "campaingId",
ADD COLUMN     "campaignId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
