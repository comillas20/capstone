/*
  Warnings:

  - Made the column `name` on table `subsets` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `subsets` MODIFY `name` VARCHAR(50) NOT NULL;
