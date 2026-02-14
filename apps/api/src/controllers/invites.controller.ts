import type { Request, Response } from "express";
import {
  acceptInvite,
  createInvite,
  listInvites,
  revokeInvite,
  validateInvite,
} from "../services/invites.service.js";

export async function listInvitesController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const result = await listInvites(clinicId);
    return res.json(result.ok ? result.data : []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar convites." });
  }
}

export async function createInviteController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const { email, role, daysValid } = req.body ?? {};

    const result = await createInvite({ clinicId, email, role, daysValid });

    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar convite." });
  }
}

export async function validateInviteController(req: Request, res: Response) {
  try {
    const token = String(req.params.token);
    const result = await validateInvite(token);

    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao validar convite." });
  }
}

export async function acceptInviteController(req: Request, res: Response) {
  try {
    const { token, name, password } = req.body ?? {};
    const result = await acceptInvite({ token, name, password });

    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao aceitar convite." });
  }
}

export async function revokeInviteController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const inviteId = String(req.params.id);

    const result = await revokeInvite({ clinicId, inviteId });

    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao revogar convite." });
  }
}
