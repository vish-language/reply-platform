-- CreateTable
CREATE TABLE `ai_settings` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `autoReplyEnabled` BOOLEAN NOT NULL DEFAULT true,
    `tone` VARCHAR(191) NOT NULL DEFAULT 'professional',
    `language` VARCHAR(191) NOT NULL DEFAULT 'English',
    `instructions` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ai_settings_organizationId_key`(`organizationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ai_settings` ADD CONSTRAINT `ai_settings_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
