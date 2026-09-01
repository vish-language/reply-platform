/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,externalCommentId]` on the table `comments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `comments_organizationId_externalCommentId_key` ON `comments`(`organizationId`, `externalCommentId`);
