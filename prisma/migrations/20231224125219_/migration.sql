/*
  Warnings:

  - You are about to drop the `maintainancedates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `maintainancedates` DROP FOREIGN KEY `MaintainanceDates_adminSettingsID_fkey`;

-- DropTable
DROP TABLE `maintainancedates`;
