/*
  Warnings:

  - You are about to drop the column `courseID` on the `dish` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `dish` DROP FOREIGN KEY `Dish_courseID_fkey`;

-- AlterTable
ALTER TABLE `dish` DROP COLUMN `courseID`;
