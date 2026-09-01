-- AlterTable
ALTER TABLE `replies` ADD COLUMN `generatedBy` VARCHAR(191) NULL,
    ADD COLUMN `modelName` VARCHAR(191) NULL;
