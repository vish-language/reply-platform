-- AlterTable
ALTER TABLE `billing_accounts` ADD COLUMN `planId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `billing_accounts` ADD CONSTRAINT `billing_accounts_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
