/*
  Warnings:

  - You are about to drop the column `orders` on the `Reservations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservations" DROP COLUMN "orders",
ADD COLUMN     "dishes" TEXT[];
