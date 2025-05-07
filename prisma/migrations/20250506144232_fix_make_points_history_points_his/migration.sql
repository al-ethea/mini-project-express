/*
  Warnings:

  - You are about to drop the column `paymentReceiptUrl` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_pointsHistoryId_fkey";

-- AlterTable
ALTER TABLE "registrations" ALTER COLUMN "pointsHistoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "paymentReceiptUrl";

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_pointsHistoryId_fkey" FOREIGN KEY ("pointsHistoryId") REFERENCES "points_history"("id") ON DELETE SET NULL ON UPDATE CASCADE;
