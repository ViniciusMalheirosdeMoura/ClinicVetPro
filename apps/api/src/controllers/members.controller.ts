import type { Request, Response } from "express";
import { listMembers, removeMember, updateMemberRole } from "../services/members.service.js";

export async function listMembersController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;

    const result = await listMembers(clinicId);
    if (!result.ok) return res.status(result.code).json({ error: result.error });

    return res.json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar membros." });
  }
}

export async function updateMemberRoleController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const actorUserId = req.user!.userId;
    const memberId = String(req.params.id);
    const { role } = req.body ?? {};

    if (!role) return res.status(400).json({ error: "role é obrigatório." });

    const result = await updateMemberRole({
      clinicId,
      memberId,
      newRole: role,
      actorUserId,
    });

    if (!result.ok) return res.status(result.code).json({ error: result.error });

    return res.json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar role." });
  }
}

export async function removeMemberController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const actorUserId = req.user!.userId;
    const memberId = String(req.params.id);

    const result = await removeMember({ clinicId, memberId, actorUserId });

    if (!result.ok) return res.status(result.code).json({ error: result.error });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao remover membro." });
  }
}
