/*
  Warnings:

  - You are about to drop the column `unitType` on the `otherservices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `otherservices` DROP COLUMN `unitType`,
    ADD COLUMN `unitName` VARCHAR(191) NULL;
