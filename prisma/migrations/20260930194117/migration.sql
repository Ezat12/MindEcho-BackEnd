/*
  Warnings:

  - Added the required column `urlPublicId` to the `library` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "library" ADD COLUMN     "urlPublicId" TEXT NOT NULL;
