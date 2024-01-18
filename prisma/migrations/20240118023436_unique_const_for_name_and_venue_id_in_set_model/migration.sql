/*
  Warnings:

  - A unique constraint covering the columns `[name,venueID]` on the table `Set` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Set_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Set_name_venueID_key" ON "Set"("name", "venueID");
