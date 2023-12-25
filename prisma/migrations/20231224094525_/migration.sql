/*
  Warnings:

  - A unique constraint covering the columns `[date,adminSettingsID]` on the table `MaintainanceDates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `MaintainanceDates_adminSettingsID_date_key` ON `maintainancedates`;

-- CreateIndex
CREATE UNIQUE INDEX `MaintainanceDates_date_adminSettingsID_key` ON `MaintainanceDates`(`date`, `adminSettingsID`);
