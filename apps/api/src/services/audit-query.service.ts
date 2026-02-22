import { prisma } from "../db/prisma.js";

export type AuditQueryInput = {
  clinicId: string;
  page: number;
  limit: number;
  action?: string | null;
  entity?: string | null;
  userId?: string | null;
  dateFrom?: Date | null;
  dateTo?: Date | null;
};

export async function queryAuditLogs(input: AuditQueryInput) {
  const page = Math.max(1, Number(input.page || 1));
  const limit = Math.min(100, Math.max(1, Number(input.limit || 20)));
  const skip = (page - 1) * limit;

  const where: any = {
    clinicId: input.clinicId,
  };

  if (input.action) where.action = { contains: input.action, mode: "insensitive" };
  if (input.entity) where.entity = { contains: input.entity, mode: "insensitive" };
  if (input.userId) where.userId = input.userId;

  if (input.dateFrom || input.dateTo) {
    where.createdAt = {};
    if (input.dateFrom) where.createdAt.gte = input.dateFrom;
    if (input.dateTo) where.createdAt.lte = input.dateTo;
  }

  const [total, items] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  };
}
