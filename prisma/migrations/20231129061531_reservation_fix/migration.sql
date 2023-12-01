/*
  Warnings:

  - You are about to drop the column `date` on the `reservations` table. All the data in the column will be lost.
  - Added the required column `eventDate` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `account` ADD COLUMN `image` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `reservations` DROP COLUMN `date`,
    ADD COLUMN `eventDate` DATETIME(3) NOT NULL;
