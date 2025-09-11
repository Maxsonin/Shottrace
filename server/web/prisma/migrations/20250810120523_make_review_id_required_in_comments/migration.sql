/*
  Warnings:

  - Made the column `reviewId` on table `comments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "reviewId" SET NOT NULL;
