-- DropForeignKey
ALTER TABLE `subsets` DROP FOREIGN KEY `SubSets_setID_fkey`;

-- CreateTable
CREATE TABLE `Set` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SubSets` ADD CONSTRAINT `SubSets_setID_fkey` FOREIGN KEY (`setID`) REFERENCES `Set`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
