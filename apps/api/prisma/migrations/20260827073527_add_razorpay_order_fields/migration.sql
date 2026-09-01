/*
  Warnings:

  - A unique constraint covering the columns `[razorpayOrderId]` on the table `billing_accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `billing_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `billing_accounts` ADD COLUMN `razorpayOrderId` VARCHAR(191) NULL,
    ADD COLUMN `razorpayPaymentId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `billing_accounts_razorpayOrderId_key` ON `billing_accounts`(`razorpayOrderId`);

-- CreateIndex
CREATE UNIQUE INDEX `billing_accounts_razorpayPaymentId_key` ON `billing_accounts`(`razorpayPaymentId`);
