/*
  Warnings:

  - Added the required column `duration` to the `OtherServices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAvailable` to the `OtherServices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `OtherServices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `otherservices` ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `isAvailable` BOOLEAN NOT NULL,
    ADD COLUMN `unit` INTEGER NOT NULL;
