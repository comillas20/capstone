/*
  Warnings:

  - You are about to drop the `_dishtoorders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_dishtosubsets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_dishtoorders` DROP FOREIGN KEY `_DishToOrders_A_fkey`;

-- DropForeignKey
ALTER TABLE `_dishtoorders` DROP FOREIGN KEY `_DishToOrders_B_fkey`;

-- DropForeignKey
ALTER TABLE `_dishtosubsets` DROP FOREIGN KEY `_DishToSubSets_A_fkey`;

-- DropForeignKey
ALTER TABLE `_dishtosubsets` DROP FOREIGN KEY `_DishToSubSets_B_fkey`;

-- DropTable
DROP TABLE `_dishtoorders`;

-- DropTable
DROP TABLE `_dishtosubsets`;

-- CreateTable
CREATE TABLE `_DishSubSets` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DishSubSets_AB_unique`(`A`, `B`),
    INDEX `_DishSubSets_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_OrderDishes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_OrderDishes_AB_unique`(`A`, `B`),
    INDEX `_OrderDishes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_DishSubSets` ADD CONSTRAINT `_DishSubSets_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dish`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DishSubSets` ADD CONSTRAINT `_DishSubSets_B_fkey` FOREIGN KEY (`B`) REFERENCES `SubSets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderDishes` ADD CONSTRAINT `_OrderDishes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dish`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_OrderDishes` ADD CONSTRAINT `_OrderDishes_B_fkey` FOREIGN KEY (`B`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
