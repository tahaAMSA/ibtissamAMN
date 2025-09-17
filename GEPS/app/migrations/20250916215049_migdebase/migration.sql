/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Beneficiary` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `EntrepreneurialProject` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Meal` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `SocialIntervention` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Stay` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `TimeSession` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Training` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SuperAdmin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Beneficiary" DROP CONSTRAINT "Beneficiary_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "EntrepreneurialProject" DROP CONSTRAINT "EntrepreneurialProject_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "SocialIntervention" DROP CONSTRAINT "SocialIntervention_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Stay" DROP CONSTRAINT "Stay_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "TimeSession" DROP CONSTRAINT "TimeSession_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Training" DROP CONSTRAINT "Training_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organizationId_fkey";

-- DropIndex
DROP INDEX "Activity_organizationId_idx";

-- DropIndex
DROP INDEX "Beneficiary_organizationId_createdAt_idx";

-- DropIndex
DROP INDEX "Beneficiary_organizationId_idx";

-- DropIndex
DROP INDEX "Beneficiary_organizationId_status_idx";

-- DropIndex
DROP INDEX "Budget_organizationId_idx";

-- DropIndex
DROP INDEX "Document_organizationId_idx";

-- DropIndex
DROP INDEX "Education_organizationId_idx";

-- DropIndex
DROP INDEX "Enrollment_organizationId_idx";

-- DropIndex
DROP INDEX "EntrepreneurialProject_organizationId_idx";

-- DropIndex
DROP INDEX "Meal_organizationId_idx";

-- DropIndex
DROP INDEX "Notification_organizationId_idx";

-- DropIndex
DROP INDEX "Resource_organizationId_idx";

-- DropIndex
DROP INDEX "Role_organizationId_idx";

-- DropIndex
DROP INDEX "Role_organizationId_name_key";

-- DropIndex
DROP INDEX "SocialIntervention_organizationId_idx";

-- DropIndex
DROP INDEX "Stay_organizationId_idx";

-- DropIndex
DROP INDEX "TimeSession_organizationId_idx";

-- DropIndex
DROP INDEX "Training_organizationId_idx";

-- DropIndex
DROP INDEX "User_organizationId_email_idx";

-- DropIndex
DROP INDEX "User_organizationId_idx";

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Beneficiary" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "EntrepreneurialProject" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Meal" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "SocialIntervention" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Stay" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "TimeSession" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "Training" DROP COLUMN "organizationId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "SuperAdmin";

-- DropEnum
DROP TYPE "OrganizationStatus";

-- DropEnum
DROP TYPE "PlanType";

-- DropEnum
DROP TYPE "SuperAdminRole";

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
