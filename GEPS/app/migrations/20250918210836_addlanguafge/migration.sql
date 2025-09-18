-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FR', 'AR');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "preferredLanguage" "Language" NOT NULL DEFAULT 'FR';
