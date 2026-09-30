/*
  Warnings:

  - Added the required column `imagePublicId` to the `library` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "library" ADD COLUMN     "imagePublicId" TEXT NOT NULL;
