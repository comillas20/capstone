/*
  Warnings:

  - Added the required column `packs` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "packs" INTEGER NOT NULL;
