-- DropIndex
DROP INDEX "LoginAttempt_keyType_key_idx";

-- CreateIndex
CREATE INDEX "LoginAttempt_keyType_key_createdAt_idx" ON "LoginAttempt"("keyType", "key", "createdAt");
