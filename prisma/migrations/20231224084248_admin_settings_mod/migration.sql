/*
  Warnings:

  - You are about to alter the column `openingTime` on the `adminsettings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `closingTime` on the `adminsettings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - A unique constraint covering the columns `[adminSettingsID,date]` on the table `MaintainanceDates` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `adminsettings` MODIFY `openingTime` DATETIME(3) NOT NULL,
    MODIFY `closingTime` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MaintainanceDates_adminSettingsID_date_key` ON `MaintainanceDates`(`adminSettingsID`, `date`);
