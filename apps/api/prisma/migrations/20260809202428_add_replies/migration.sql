-- CreateTable
CREATE TABLE `replies` (
    `id` VARCHAR(191) NOT NULL,
    `commentId` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `status` ENUM('PENDING', 'GENERATED', 'PUBLISHED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `replies_commentId_idx`(`commentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `replies` ADD CONSTRAINT `replies_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
