/*
  Warnings:

  - Made the column `phoneNumber` on table `account` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `account` MODIFY `phoneNumber` VARCHAR(11) NOT NULL;
