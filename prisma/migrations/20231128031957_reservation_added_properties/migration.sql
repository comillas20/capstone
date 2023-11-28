/*
  Warnings:

  - Added the required column `eventDuration` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservations` ADD COLUMN `eventDuration` DATETIME(3) NOT NULL,
    ADD COLUMN `status` ENUM('ACCEPTED', 'PENDING', 'DENIED') NOT NULL DEFAULT 'PENDING';
