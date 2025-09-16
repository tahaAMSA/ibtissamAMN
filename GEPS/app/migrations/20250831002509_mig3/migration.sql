-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BENEFICIARY_ARRIVAL', 'ORIENTATION_REQUEST', 'FORM_COMPLETION', 'SYSTEM_ALERT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BeneficiaryStatus" AS ENUM ('EN_ATTENTE_ACCUEIL', 'EN_ATTENTE_ORIENTATION', 'ORIENTE', 'EN_SUIVI', 'TERMINE');

-- CreateEnum
CREATE TYPE "MotifVisite" AS ENUM ('VIOLENCE_CONJUGALE', 'VIOLENCE_FAMILIALE', 'AGRESSION_SEXUELLE', 'HARCELEMENT', 'DISCRIMINATION', 'PROBLEMES_FAMILIAUX', 'SOUTIEN_PSYCHOLOGIQUE', 'AIDE_JURIDIQUE', 'HEBERGEMENT_URGENCE', 'AIDE_FINANCIERE', 'ORIENTATION_PROFESSIONNELLE', 'FORMATION', 'SOINS_MEDICAUX', 'PROTECTION_ENFANT', 'ACCOMPAGNEMENT_SOCIAL', 'INFORMATION_DROITS', 'AUTRE');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('HOMME', 'FEMME', 'AUTRE');

-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "assignedAt" TIMESTAMP(3),
ADD COLUMN     "assignedToId" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "orientationReason" TEXT,
ADD COLUMN     "orientedAt" TIMESTAMP(3),
ADD COLUMN     "orientedById" TEXT,
ADD COLUMN     "status" "BeneficiaryStatus" NOT NULL DEFAULT 'EN_ATTENTE_ACCUEIL',
ADD COLUMN     "visitReason" "MotifVisite",
ADD COLUMN     "visitReasonOther" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "customRoleId" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstNameAr" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastNameAr" TEXT;

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "module" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "ownRecordsOnly" BOOLEAN NOT NULL DEFAULT false,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "beneficiaryId" TEXT,
    "metadata" JSONB,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_module_action_key" ON "Permission"("roleId", "module", "action");

-- CreateIndex
CREATE INDEX "Notification_receiverId_status_idx" ON "Notification"("receiverId", "status");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_customRoleId_fkey" FOREIGN KEY ("customRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_orientedById_fkey" FOREIGN KEY ("orientedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE SET NULL ON UPDATE CASCADE;
