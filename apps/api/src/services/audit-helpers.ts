import type { Request } from "express";
import { auditLog } from "./audit.service.js";
import { getClientIp, getUserAgent } from "../http/request-meta.js";

export async function auditCrud(req: Request, input: {
  action: string;            
  entity: string;            
  entityId?: string | null;  
  clinicId?: string | null;  
  metadata?: any;
}) {
  const ip = getClientIp(req);
  const userAgent = getUserAgent(req);

 
  const userId = (req as any)?.user?.id ?? null;

  await auditLog({
    action: input.action,
    entity: input.entity,
    entityId: input.entityId ?? null,
    clinicId: input.clinicId ?? ((req as any)?.user?.clinicId ?? null),
    userId,
    ip,
    userAgent,
    metadata: input.metadata ?? undefined,
  });
}
