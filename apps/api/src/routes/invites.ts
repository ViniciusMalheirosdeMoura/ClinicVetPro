import { Router } from "express";
import { randomBytes } from "crypto";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import { hashPassword } from "../auth/password.js";
import { signAccessToken } from "../auth/jwt.js";

export const invitesRouter = Router();

function makeToken() {
  return randomBytes(24).toString("hex"); 
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

invitesRouter.get(
  "/",
  requireAuth,
  authorize(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;

      const invites = await prisma.invite.findMany({
        where: { clinicId },
        orderBy: { expiresAt: "desc" },
      });

      return res.json(invites);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar convites." });
    }
  }
);

invitesRouter.post(
  "/",
  requireAuth,
  authorize(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const { email, role, daysValid } = req.body ?? {};

      if (!email || !role) {
        return res.status(400).json({ error: "email e role são obrigatórios." });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const token = makeToken();
      const now = new Date();
      const expiresAt = addDays(now, Number(daysValid ?? 7));

      const invite = await prisma.invite.create({
        data: {
          clinicId,
          email: normalizedEmail,
          role,
          token,
          expiresAt,
        },
      });

      
      const link = `/invite/${invite.token}`;

      return res.status(201).json({ invite, link });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar convite." });
    }
  }
);


invitesRouter.get("/:token", async (req, res) => {
  try {
    const token = String(req.params.token);

    const invite = await prisma.invite.findUnique({
      where: { token },
      include: {
        clinic: {
          select: { id: true, name: true },
        },
      },
    });

    if (!invite) {
      return res.status(404).json({ error: "Convite não encontrado." });
    }

    if (invite.usedAt) {
      return res.status(409).json({ error: "Convite já utilizado." });
    }

    if (invite.expiresAt.getTime() < Date.now()) {
      return res.status(410).json({ error: "Convite expirado." });
    }

    return res.json({
      clinic: invite.clinic,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao validar convite." });
  }
});


invitesRouter.post("/accept", async (req, res) => {
  try {
    const { token, name, password } = req.body ?? {};

    if (!token || !name || !password) {
      return res.status(400).json({ error: "token, name e password são obrigatórios." });
    }

    const invite = await prisma.invite.findUnique({
      where: { token: String(token) },
    });

    if (!invite) return res.status(404).json({ error: "Convite não encontrado." });
    if (invite.usedAt) return res.status(409).json({ error: "Convite já utilizado." });

    const now = new Date();
    if (invite.expiresAt.getTime() < now.getTime()) {
      return res.status(410).json({ error: "Convite expirado." });
    }

  
    const existingUser = await prisma.user.findUnique({
      where: { email: invite.email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Já existe um usuário com este e-mail. Faça login (vamos implementar depois).",
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: String(name).trim(),
          email: invite.email,
          password: await hashPassword(String(password)),
        },
      });

      const member = await tx.clinicMember.create({
        data: {
          clinicId: invite.clinicId,
          userId: user.id,
          role: invite.role,
        },
      });

      await tx.invite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() },
      });

      const token = signAccessToken({
        userId: user.id,
        clinicId: member.clinicId,
        role: member.role,
      });

      return {
        user: { id: user.id, name: user.name, email: user.email },
        clinicId: member.clinicId,
        role: member.role,
        token,
      };
    });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao aceitar convite." });
  }
});

invitesRouter.post(
  "/:id/revoke",
  requireAuth,
  authorize(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const id = String(req.params.id);

      const invite = await prisma.invite.findFirst({
        where: { id, clinicId },
        select: { id: true, usedAt: true },
      });

      if (!invite) return res.status(404).json({ error: "Convite não encontrado." });
      if (invite.usedAt) return res.status(409).json({ error: "Convite já foi utilizado." });

      await prisma.invite.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao revogar convite." });
    }
  }
);
