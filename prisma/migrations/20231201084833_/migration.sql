/*
  Warnings:

  - You are about to drop the column `selectionType` on the `subsets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `subsets` DROP COLUMN `selectionType`,
    ADD COLUMN `selectionQuantity` INTEGER NOT NULL DEFAULT 1;
