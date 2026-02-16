/*
  Warnings:

  - You are about to drop the column `uniqueId` on the `Link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[urlId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `urlId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Link_uniqueId_key";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "uniqueId",
ADD COLUMN     "urlId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Link_urlId_key" ON "Link"("urlId");
