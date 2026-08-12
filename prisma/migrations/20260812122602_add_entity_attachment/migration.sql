/*
  Warnings:

  - You are about to drop the column `attachments` on the `journals` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- DropForeignKey
ALTER TABLE "journals" DROP CONSTRAINT "journals_userId_fkey";

-- AlterTable
ALTER TABLE "journals" DROP COLUMN "attachments";

-- CreateTable
CREATE TABLE "JournalAttachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "attachmentType" "AttachmentType" NOT NULL,
    "journalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JournalAttachment_journalId_idx" ON "JournalAttachment"("journalId");

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalAttachment" ADD CONSTRAINT "JournalAttachment_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
