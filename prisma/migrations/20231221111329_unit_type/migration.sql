/*
  Warnings:

  - The primary key for the `reservations` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_reservationsdishes` DROP FOREIGN KEY `_ReservationsDishes_B_fkey`;

-- AlterTable
ALTER TABLE `_reservationsdishes` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `otherservices` ADD COLUMN `unitType` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reservations` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `_ReservationsDishes` ADD CONSTRAINT `_ReservationsDishes_B_fkey` FOREIGN KEY (`B`) REFERENCES `Reservations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
