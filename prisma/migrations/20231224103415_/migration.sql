/*
  Warnings:

  - A unique constraint covering the columns `[date,adminSettingsID]` on the table `MaintainanceDates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `maintainancedates` DROP FOREIGN KEY `MaintainanceDates_adminSettingsID_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `MaintainanceDates_date_adminSettingsID_key` ON `MaintainanceDates`(`date`, `adminSettingsID`);

-- AddForeignKey
ALTER TABLE `MaintainanceDates` ADD CONSTRAINT `MaintainanceDates_adminSettingsID_fkey` FOREIGN KEY (`adminSettingsID`) REFERENCES `AdminSettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
