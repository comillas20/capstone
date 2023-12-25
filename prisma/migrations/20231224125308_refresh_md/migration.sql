-- CreateTable
CREATE TABLE `MaintainanceDates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `adminSettingsID` INTEGER NOT NULL,

    UNIQUE INDEX `MaintainanceDates_adminSettingsID_date_key`(`adminSettingsID`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaintainanceDates` ADD CONSTRAINT `MaintainanceDates_adminSettingsID_fkey` FOREIGN KEY (`adminSettingsID`) REFERENCES `AdminSettings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
