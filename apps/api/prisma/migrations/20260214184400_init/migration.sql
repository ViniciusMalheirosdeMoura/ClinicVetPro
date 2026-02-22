/*
  Warnings:

  - Added the required column `clinicId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "clinicId" TEXT NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateIndex
CREATE INDEX "RefreshToken_clinicId_idx" ON "RefreshToken"("clinicId");
