/*
  Warnings:

  - You are about to drop the column `totalPaid` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the column `fee` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `netAmount` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `paymentID` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `recipientNumber` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referenceNumber` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ReservationStatus" ADD VALUE 'PENDING';
ALTER TYPE "ReservationStatus" ADD VALUE 'PARTIAL';

-- AlterTable
ALTER TABLE "Reservations" DROP COLUMN "totalPaid",
ALTER COLUMN "status" SET DEFAULT 'ONGOING';

-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "fee",
DROP COLUMN "netAmount",
DROP COLUMN "paymentID",
ADD COLUMN     "recipientNumber" TEXT NOT NULL,
ADD COLUMN     "referenceNumber" TEXT NOT NULL;
