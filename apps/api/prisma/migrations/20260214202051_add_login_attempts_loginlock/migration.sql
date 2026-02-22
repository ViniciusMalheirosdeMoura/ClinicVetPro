/*
  Warnings:

  - Added the required column `key` to the `LoginAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyType` to the `LoginAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoginKeyType" AS ENUM ('EMAIL', 'IP');

-- AlterTable
ALTER TABLE "LoginAttempt" ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "keyType" "LoginKeyType" NOT NULL,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "LoginLock" (
    "id" TEXT NOT NULL,
    "keyType" "LoginKeyType" NOT NULL,
    "key" TEXT NOT NULL,
    "lockedUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LoginLock_lockedUntil_idx" ON "LoginLock"("lockedUntil");

-- CreateIndex
CREATE UNIQUE INDEX "LoginLock_keyType_key_key" ON "LoginLock"("keyType", "key");

-- CreateIndex
CREATE INDEX "LoginAttempt_keyType_key_idx" ON "LoginAttempt"("keyType", "key");
