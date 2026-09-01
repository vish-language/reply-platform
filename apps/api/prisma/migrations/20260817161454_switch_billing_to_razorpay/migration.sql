/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `billing_accounts` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `billing_accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayCustomerId]` on the table `billing_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpaySubscriptionId]` on the table `billing_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `billing_accounts_stripeCustomerId_key` ON `billing_accounts`;

-- DropIndex
DROP INDEX `billing_accounts_stripeSubscriptionId_key` ON `billing_accounts`;

-- AlterTable
ALTER TABLE `billing_accounts` DROP COLUMN `stripeCustomerId`,
    DROP COLUMN `stripeSubscriptionId`,
    ADD COLUMN `razorpayCustomerId` VARCHAR(191) NULL,
    ADD COLUMN `razorpaySubscriptionId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `billing_accounts_razorpayCustomerId_key` ON `billing_accounts`(`razorpayCustomerId`);

-- CreateIndex
CREATE UNIQUE INDEX `billing_accounts_razorpaySubscriptionId_key` ON `billing_accounts`(`razorpaySubscriptionId`);
