/*
  Warnings:

  - The values [ACCEPTED,PENDING,DENIED,IGNORED] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `fee` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the column `net_amount` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the column `payment_id` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the column `reservedAt` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reservations` table. All the data in the column will be lost.
  - You are about to drop the `Itemlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPreference` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VenueList` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `eventType` to the `Reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueID` to the `Set` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('ONGOING', 'CANCELED');
ALTER TABLE "Reservations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Reservations" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "ReservationStatus_old";
ALTER TABLE "Reservations" ALTER COLUMN "status" SET DEFAULT 'ONGOING';
COMMIT;

-- DropForeignKey
ALTER TABLE "UserPreference" DROP CONSTRAINT "UserPreference_accountID_fkey";

-- AlterTable
ALTER TABLE "Reservations" DROP COLUMN "fee",
DROP COLUMN "message",
DROP COLUMN "net_amount",
DROP COLUMN "payment_id",
DROP COLUMN "reservedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "eventType" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ONGOING';

-- AlterTable
ALTER TABLE "Set" ADD COLUMN     "venueID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Itemlist";

-- DropTable
DROP TABLE "UserPreference";

-- DropTable
DROP TABLE "VenueList";

-- CreateTable
CREATE TABLE "Transactions" (
    "id" TEXT NOT NULL,
    "paymentID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "reservationID" TEXT NOT NULL,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venues" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "freeHours" INTEGER NOT NULL,
    "venueCost" DOUBLE PRECISION NOT NULL,
    "maxCapacity" INTEGER NOT NULL,

    CONSTRAINT "Venues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_reservationID_fkey" FOREIGN KEY ("reservationID") REFERENCES "Reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_venueID_fkey" FOREIGN KEY ("venueID") REFERENCES "Venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
