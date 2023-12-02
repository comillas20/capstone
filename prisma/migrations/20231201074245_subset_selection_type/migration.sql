-- AlterTable
ALTER TABLE `subsets` ADD COLUMN `selectionType` INTEGER NOT NULL DEFAULT 1,
    MODIFY `name` VARCHAR(50) NULL;
