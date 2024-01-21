/*
  Warnings:

  - The values [CANCELED] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('PENDING', 'PARTIAL', 'ONGOING', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Reservations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Reservations" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "ReservationStatus_old";
ALTER TABLE "Reservations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
