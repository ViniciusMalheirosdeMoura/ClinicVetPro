import { prisma } from "../db/prisma.js";

export type AuditEvent = {
  clinicId?: string | null;
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: any; 
};

export async function auditLog(event: AuditEvent) {


  const safe = sanitize(event);

  await prisma.auditLog.create({
    data: {
      clinicId: safe.clinicId ?? null,
      userId: safe.userId ?? null,
      action: safe.action,
      entity: safe.entity ?? null,
      entityId: safe.entityId ?? null,
      ip: safe.ip ?? null,
      userAgent: safe.userAgent ?? null,
      metadata: safe.metadata ?? undefined,
    },
  });
}

function sanitize(event: AuditEvent): AuditEvent {
  const copy: AuditEvent = { ...event };

  if (copy.metadata && typeof copy.metadata === "object") {
    const m = { ...copy.metadata };
    delete m.password;
    delete m.refreshToken;
    delete m.accessToken;
    delete m.token;
    delete m.tokenHash;
    copy.metadata = m;
  }

  return copy;
}
