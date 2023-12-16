-- AlterTable
ALTER TABLE `set` ADD COLUMN `description` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `AdminSettings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `openingTime` VARCHAR(191) NOT NULL,
    `closingTime` VARCHAR(191) NOT NULL,
    `minimumCustomerReservationHours` INTEGER NOT NULL,
    `maximumCustomerReservationHours` INTEGER NOT NULL,
    `defaultMinimumPerHead` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaintainanceDates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `adminSettingsID` INTEGER NOT NULL,

    UNIQUE INDEX `MaintainanceDates_adminSettingsID_key`(`adminSettingsID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaintainanceDates` ADD CONSTRAINT `MaintainanceDates_adminSettingsID_fkey` FOREIGN KEY (`adminSettingsID`) REFERENCES `AdminSettings`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
