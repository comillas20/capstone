/*
  Warnings:

  - Added the required column `venue` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "venue" TEXT NOT NULL;
