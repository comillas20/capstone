/*
  Warnings:

  - Added the required column `payment_id` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "payment_id" TEXT NOT NULL;
