/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Dish` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseID` to the `SubSets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subsets` ADD COLUMN `courseID` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dish_name_key` ON `Dish`(`name`);

-- AddForeignKey
ALTER TABLE `SubSets` ADD CONSTRAINT `SubSets_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
