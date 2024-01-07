/*
  Warnings:

  - You are about to drop the column `totalPrice` on the `Reservations` table. All the data in the column will be lost.
  - Added the required column `fee` to the `Reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `net_amount` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" DROP COLUMN "totalPrice",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "net_amount" DOUBLE PRECISION NOT NULL;
