
import { prisma } from "../db/prisma.js";
import { LOGIN_POLICY } from "../auth/login-policy.js";


type CheckInput = { email: string; ip: string };

function now() {
  return new Date();
}

function subMs(date: Date, ms: number) {
  return new Date(date.getTime() - ms);
}

function addMs(date: Date, ms: number) {
  return new Date(date.getTime() + ms);
}


export async function canAttemptLogin({ email, ip }: CheckInput): Promise<
  | { ok: true }
  | { ok: false; reason: "LOCKED"; until: Date }
  | { ok: false; reason: "RATE_LIMIT"; retryAfterSeconds: number }
> {
  const tNow = now();
  const windowStart = subMs(tNow, LOGIN_POLICY.windowMs);


  const emailLock = await prisma.loginLock.findFirst({
    where: { keyType: "EMAIL", key: email.toLowerCase(), lockedUntil: { gt: tNow } },
    orderBy: { lockedUntil: "desc" },
  });

  if (emailLock) {
    return { ok: false, reason: "LOCKED", until: emailLock.lockedUntil };
  }

  const ipLock = await prisma.loginLock.findFirst({
    where: { keyType: "IP", key: ip, lockedUntil: { gt: tNow } },
    orderBy: { lockedUntil: "desc" },
  });

  if (ipLock) {
    return { ok: false, reason: "LOCKED", until: ipLock.lockedUntil };
  }

  const attemptsEmail = await prisma.loginAttempt.count({
    where: { keyType: "EMAIL", key: email.toLowerCase(), createdAt: { gte: windowStart } },
  });

  if (attemptsEmail >= LOGIN_POLICY.maxAttemptsPerEmail) {
    return { ok: false, reason: "RATE_LIMIT", retryAfterSeconds: Math.ceil(LOGIN_POLICY.windowMs / 1000) };
  }

  
  const attemptsIp = await prisma.loginAttempt.count({
    where: { keyType: "IP", key: ip, createdAt: { gte: windowStart } },
  });

  if (attemptsIp >= LOGIN_POLICY.maxAttemptsPerIp) {
    return { ok: false, reason: "RATE_LIMIT", retryAfterSeconds: Math.ceil(LOGIN_POLICY.windowMs / 1000) };
  }

  return { ok: true };
}


export async function registerLoginAttempt(input: {
  email: string;
  ip: string;
  userAgent?: string | null;
  success: boolean;
}): Promise<void> {
  const tNow = now();
  const windowStart = subMs(tNow, LOGIN_POLICY.windowMs);

  const emailKey = input.email.toLowerCase();
  const ipKey = input.ip;


await prisma.loginAttempt.createMany({
  data: [
    {
      keyType: "EMAIL",
      key: emailKey,
      email: emailKey, 
      success: input.success,
      ip: input.ip,
      userAgent: input.userAgent ?? null,
    },
    {
      keyType: "IP",
      key: ipKey,
      email: emailKey, 
      success: input.success,
      ip: input.ip,
      userAgent: input.userAgent ?? null,
    },
  ],
});

  if (input.success) return;


  const failuresEmail = await prisma.loginAttempt.count({
    where: {
      keyType: "EMAIL",
      key: emailKey,
      success: false,
      createdAt: { gte: windowStart },
    },
  });

  if (failuresEmail >= LOGIN_POLICY.maxFailuresPerEmail) {
    await lock("EMAIL", emailKey, addMs(tNow, LOGIN_POLICY.lockMs));
  }

  const failuresIp = await prisma.loginAttempt.count({
    where: {
      keyType: "IP",
      key: ipKey,
      success: false,
      createdAt: { gte: windowStart },
    },
  });

  if (failuresIp >= LOGIN_POLICY.maxFailuresPerIp) {
    await lock("IP", ipKey, addMs(tNow, LOGIN_POLICY.lockMs));
  }
}

async function lock(keyType: "EMAIL" | "IP", key: string, lockedUntil: Date) {
  
  await prisma.loginLock.upsert({
    where: { keyType_key: { keyType, key } },
    update: { lockedUntil },
    create: { keyType, key, lockedUntil },
  });
}
