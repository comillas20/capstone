/*
  Warnings:

  - You are about to drop the `set` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `subsets` DROP FOREIGN KEY `SubSets_setID_fkey`;

-- DropTable
DROP TABLE `set`;

-- AddForeignKey
ALTER TABLE `SubSets` ADD CONSTRAINT `SubSets_setID_fkey` FOREIGN KEY (`setID`) REFERENCES `subSets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
