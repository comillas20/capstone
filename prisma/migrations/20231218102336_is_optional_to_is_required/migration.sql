/*
  Warnings:

  - You are about to drop the column `isOptional` on the `otherservices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `dish` MODIFY `isAvailable` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `otherservices` DROP COLUMN `isOptional`,
    ADD COLUMN `isRequired` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `isAvailable` BOOLEAN NOT NULL DEFAULT false;
