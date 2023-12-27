/*
  Warnings:

  - You are about to drop the column `email` on the `account` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Account_email_key` ON `account`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `email`;
