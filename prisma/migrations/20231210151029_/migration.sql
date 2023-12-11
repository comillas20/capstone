/*
  Warnings:

  - A unique constraint covering the columns `[name,setID]` on the table `SubSets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `SubSets_name_setID_key` ON `SubSets`(`name`, `setID`);
