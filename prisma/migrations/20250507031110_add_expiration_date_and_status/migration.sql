/*
  Warnings:

  - The `discountStatus` column on the `referrals` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `discountExpireAt` to the `referrals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('USED', 'ACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "PointsStatus" AS ENUM ('USED', 'ACTIVE', 'EXPIRED');

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_pointsHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_referralId_fkey";

-- AlterTable
ALTER TABLE "points_history" ADD COLUMN     "pointsStatus" "PointsStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "referrals" ADD COLUMN     "discountExpireAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "discountStatus",
ADD COLUMN     "discountStatus" "DiscountStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "registrations" ALTER COLUMN "pointsHistoryId" DROP NOT NULL,
ALTER COLUMN "referralId" DROP NOT NULL;

-- DropEnum
DROP TYPE "discountStatus";

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_pointsHistoryId_fkey" FOREIGN KEY ("pointsHistoryId") REFERENCES "points_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;
