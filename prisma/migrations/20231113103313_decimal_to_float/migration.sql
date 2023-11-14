/*
  Warnings:

  - You are about to alter the column `price` on the `dish` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `price` on the `otherservices` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `totalPrice` on the `reservations` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `dish` MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `otherservices` MODIFY `price` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `reservations` MODIFY `totalPrice` DOUBLE NOT NULL;
