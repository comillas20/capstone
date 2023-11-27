/*
  Warnings:

  - You are about to drop the column `preferenceID` on the `account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[accountID]` on the table `UserPreference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountID` to the `UserPreference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `account` DROP FOREIGN KEY `Account_preferenceID_fkey`;

-- AlterTable
ALTER TABLE `account` DROP COLUMN `preferenceID`;

-- AlterTable
ALTER TABLE `userpreference` ADD COLUMN `accountID` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `UserPreference_accountID_key` ON `UserPreference`(`accountID`);

-- AddForeignKey
ALTER TABLE `UserPreference` ADD CONSTRAINT `UserPreference_accountID_fkey` FOREIGN KEY (`accountID`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
