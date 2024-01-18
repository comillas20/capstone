/*
  Warnings:

  - Added the required column `totalPaid` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "totalPaid" DOUBLE PRECISION NOT NULL;
