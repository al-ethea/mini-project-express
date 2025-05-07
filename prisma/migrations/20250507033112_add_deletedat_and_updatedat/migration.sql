/*
  Warnings:

  - Added the required column `updatedAt` to the `points_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `referrals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "points_history" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "referrals" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
