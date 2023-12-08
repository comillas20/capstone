/*
  Warnings:

  - You are about to drop the column `price` on the `dish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dish` DROP COLUMN `price`;

-- AlterTable
ALTER TABLE `set` ADD COLUMN `price` DOUBLE NOT NULL DEFAULT 250;
