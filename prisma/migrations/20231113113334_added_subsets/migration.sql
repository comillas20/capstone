/*
  Warnings:

  - You are about to drop the column `setID` on the `dish` table. All the data in the column will be lost.
  - Added the required column `subSetID` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `dish` DROP FOREIGN KEY `Dish_setID_fkey`;

-- AlterTable
ALTER TABLE `dish` DROP COLUMN `setID`,
    ADD COLUMN `subSetID` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `SubSets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `setID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DishToSubSets` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DishToSubSets_AB_unique`(`A`, `B`),
    INDEX `_DishToSubSets_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubSets` ADD CONSTRAINT `SubSets_setID_fkey` FOREIGN KEY (`setID`) REFERENCES `Set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DishToSubSets` ADD CONSTRAINT `_DishToSubSets_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dish`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DishToSubSets` ADD CONSTRAINT `_DishToSubSets_B_fkey` FOREIGN KEY (`B`) REFERENCES `SubSets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
