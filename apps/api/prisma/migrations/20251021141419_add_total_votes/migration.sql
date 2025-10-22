-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "totalVotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "totalVotes" INTEGER NOT NULL DEFAULT 0;
