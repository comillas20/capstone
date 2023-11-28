/*
  Warnings:

  - You are about to drop the `_orderdishes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_orderdishes` DROP FOREIGN KEY `_OrderDishes_A_fkey`;

-- DropForeignKey
ALTER TABLE `_orderdishes` DROP FOREIGN KEY `_OrderDishes_B_fkey`;

-- DropTable
DROP TABLE `_orderdishes`;

-- DropTable
DROP TABLE `orders`;

-- CreateTable
CREATE TABLE `_ReservationsDishes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ReservationsDishes_AB_unique`(`A`, `B`),
    INDEX `_ReservationsDishes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ReservationsDishes` ADD CONSTRAINT `_ReservationsDishes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dish`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReservationsDishes` ADD CONSTRAINT `_ReservationsDishes_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reservations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
