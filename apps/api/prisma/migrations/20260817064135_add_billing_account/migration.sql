-- CreateTable
CREATE TABLE `billing_accounts` (
    `id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `stripeCustomerId` VARCHAR(191) NOT NULL,
    `stripeSubscriptionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `billing_accounts_organizationId_key`(`organizationId`),
    UNIQUE INDEX `billing_accounts_stripeCustomerId_key`(`stripeCustomerId`),
    UNIQUE INDEX `billing_accounts_stripeSubscriptionId_key`(`stripeSubscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `billing_accounts` ADD CONSTRAINT `billing_accounts_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
