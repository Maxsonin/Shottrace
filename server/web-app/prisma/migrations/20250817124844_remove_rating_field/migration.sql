/*
  Warnings:

  - You are about to drop the column `rating` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,reviewId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,commentId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_userId_reviewId_commentId_key";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "rating";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "rating";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_reviewId_key" ON "Vote"("userId", "reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_commentId_key" ON "Vote"("userId", "commentId");
