-- DropForeignKey
ALTER TABLE `dish` DROP FOREIGN KEY `Dish_categoryID_fkey`;

-- DropForeignKey
ALTER TABLE `dish` DROP FOREIGN KEY `Dish_courseID_fkey`;

-- DropForeignKey
ALTER TABLE `subsets` DROP FOREIGN KEY `SubSets_courseID_fkey`;

-- AddForeignKey
ALTER TABLE `Dish` ADD CONSTRAINT `Dish_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dish` ADD CONSTRAINT `Dish_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubSets` ADD CONSTRAINT `SubSets_courseID_fkey` FOREIGN KEY (`courseID`) REFERENCES `Course`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
