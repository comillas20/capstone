/*
  Warnings:

  - Added the required column `reservationCostPerHour` to the `AdminSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `adminsettings` ADD COLUMN `reservationCostPerHour` INTEGER NOT NULL;
