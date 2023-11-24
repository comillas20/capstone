/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Set` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `dish` ADD COLUMN `imgHref` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Course_name_key` ON `Course`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Set_name_key` ON `Set`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
