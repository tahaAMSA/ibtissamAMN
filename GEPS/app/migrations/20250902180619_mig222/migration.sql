/*
  Warnings:

  - You are about to drop the column `isDefault` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isSystem` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "isDefault",
DROP COLUMN "isSystem",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
