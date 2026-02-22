
import { prisma } from "../db/prisma.js";
import { LOGIN_CLEANUP_POLICY } from "../auth/login-cleanup-policy.js";

function subDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

export async function cleanupLoginSecurityTables() {
  const now = new Date();
  const cutoff = subDays(now, LOGIN_CLEANUP_POLICY.attemptsRetentionDays);

 
  const deletedAttempts = await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  const deletedLocks = await prisma.loginLock.deleteMany({
    where: { lockedUntil: { lte: now } },
  });

  return { deletedAttempts: deletedAttempts.count, deletedLocks: deletedLocks.count };
}
