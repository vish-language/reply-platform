-- AlterTable
ALTER TABLE `comments` ADD COLUMN `googleReviewName` VARCHAR(191) NULL,
    ADD COLUMN `rating` INTEGER NULL;

-- AlterTable
ALTER TABLE `google_integrations` ADD COLUMN `googleAccountId` VARCHAR(191) NULL;
