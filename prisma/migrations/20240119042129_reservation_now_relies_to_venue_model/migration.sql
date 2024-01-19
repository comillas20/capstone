/*
  Warnings:

  - You are about to drop the column `venue` on the `Reservations` table. All the data in the column will be lost.
  - Added the required column `venueID` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" DROP COLUMN "venue",
ADD COLUMN     "venueID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Venues" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_venueID_fkey" FOREIGN KEY ("venueID") REFERENCES "Venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
