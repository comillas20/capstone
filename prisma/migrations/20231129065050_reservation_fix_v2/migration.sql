/*
  Warnings:

  - You are about to drop the column `createdAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to alter the column `userID` on the `reservations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Changed the type of `eventDuration` on the `reservations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `reservations` DROP COLUMN `createdAt`,
    ADD COLUMN `reservedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `userID` INTEGER NOT NULL,
    DROP COLUMN `eventDuration`,
    ADD COLUMN `eventDuration` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
