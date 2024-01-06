/*
  Warnings:

  - You are about to drop the `_ReservationsDishes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `setName` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ReservationsDishes" DROP CONSTRAINT "_ReservationsDishes_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReservationsDishes" DROP CONSTRAINT "_ReservationsDishes_B_fkey";

-- AlterTable
ALTER TABLE "Reservations" ADD COLUMN     "orders" TEXT[],
ADD COLUMN     "setName" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ReservationsDishes";
