/*
  Warnings:

  - Added the required column `venueID` to the `MaintainanceDates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MaintainanceDates" ADD COLUMN     "venueID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MaintainanceDates" ADD CONSTRAINT "MaintainanceDates_venueID_fkey" FOREIGN KEY ("venueID") REFERENCES "Venues"("id") ON DELETE CASCADE ON UPDATE CASCADE;
