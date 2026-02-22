import type { Request, Response } from "express";
import { queryAuditLogs } from "../services/audit-query.service.js";

export async function listAuditController(req: Request, res: Response) {
  try {
    const role = req.user!.role;
    if (role !== "OWNER" && role !== "ADMIN") {
      return res.status(403).json({ error: "Sem permissão." });
    }

    const clinicId = req.user!.clinicId;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const action = req.query.action ? String(req.query.action) : null;
    const entity = req.query.entity ? String(req.query.entity) : null;
    const userId = req.query.userId ? String(req.query.userId) : null;

    const dateFrom = req.query.from ? new Date(String(req.query.from)) : null;
    const dateTo = req.query.to ? new Date(String(req.query.to)) : null;

    const result = await queryAuditLogs({
      clinicId,
      page,
      limit,
      action,
      entity,
      userId,
      dateFrom: dateFrom && !Number.isNaN(dateFrom.getTime()) ? dateFrom : null,
      dateTo: dateTo && !Number.isNaN(dateTo.getTime()) ? dateTo : null,
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar auditoria." });
  }
}
