import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";

export const membersRouter = Router();


membersRouter.get(
  "/",
  requireAuth,
  authorize(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;

      const members = await prisma.clinicMember.findMany({
        where: { clinicId },
        orderBy: { role: "asc" },
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
        },
      });

      return res.json(members);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar membros." });
    }
  }
);


membersRouter.patch(
  "/:id/role",
  requireAuth,
  authorize(["OWNER"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const id = String(req.params.id);
      const { role } = req.body ?? {};

      if (!role) return res.status(400).json({ error: "role é obrigatório." });

      const member = await prisma.clinicMember.findFirst({
        where: { id, clinicId },
        select: { id: true, userId: true, role: true },
      });

      if (!member) return res.status(404).json({ error: "Membro não encontrado." });

    
      if (member.userId === req.user!.userId && role !== "OWNER") {
        return res.status(409).json({ error: "Você não pode alterar seu próprio papel de OWNER." });
      }

      const updated = await prisma.clinicMember.update({
        where: { id },
        data: { role },
      });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao atualizar role." });
    }
  }
);


membersRouter.delete(
  "/:id",
  requireAuth,
  authorize(["OWNER"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const id = String(req.params.id);

      const member = await prisma.clinicMember.findFirst({
        where: { id, clinicId },
        select: { id: true, userId: true, role: true },
      });

      if (!member) return res.status(404).json({ error: "Membro não encontrado." });

      if (member.userId === req.user!.userId) {
        return res.status(409).json({ error: "Você não pode remover a si mesmo." });
      }

      await prisma.clinicMember.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao remover membro." });
    }
  }
);
