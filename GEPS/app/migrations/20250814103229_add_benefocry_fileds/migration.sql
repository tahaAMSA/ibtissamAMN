-- AlterTable
ALTER TABLE "Beneficiary" ADD COLUMN     "birthPlace" TEXT,
ADD COLUMN     "educationLevel" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "healthConditions" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "monthlyIncome" INTEGER DEFAULT 0,
ADD COLUMN     "nationalId" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "numberOfChildren" INTEGER DEFAULT 0;
