import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";

export const appointmentsRouter = Router();

appointmentsRouter.get(
  "/day",
  requireAuth,
  authorize(["OWNER", "ADMIN", "DOCTOR", "RECEPTION"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: "date é obrigatório (YYYY-MM-DD)." });
      }

      const base = new Date(String(date));
      if (Number.isNaN(base.getTime())) {
        return res.status(400).json({ error: "date inválido. Use YYYY-MM-DD." });
      }

      const startOfDay = new Date(base);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(base);
      endOfDay.setHours(23, 59, 59, 999);

      const items = await prisma.appointment.findMany({
        where: {
          clinicId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: { date: "asc" },
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              tutor: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar agenda do dia." });
    }
  }
);


appointmentsRouter.get(
  "/",
  requireAuth,
  authorize(["OWNER", "ADMIN", "DOCTOR", "RECEPTION"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;

      const from = req.query.from ? new Date(String(req.query.from)) : null;
      const to = req.query.to ? new Date(String(req.query.to)) : null;

      if (from && Number.isNaN(from.getTime())) {
        return res.status(400).json({ error: "Query param 'from' inválido (ISO)." });
      }
      if (to && Number.isNaN(to.getTime())) {
        return res.status(400).json({ error: "Query param 'to' inválido (ISO)." });
      }

      const where: any = { clinicId };
      if (from || to) {
        where.date = {};
        if (from) where.date.gte = from;
        if (to) where.date.lte = to;
      }

      const items = await prisma.appointment.findMany({
        where,
        orderBy: { date: "asc" },
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              tutor: { select: { id: true, name: true } },
            },
          },
        },
      });

      return res.json(items);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao listar agendamentos." });
    }
  }
);


appointmentsRouter.post(
  "/",
  requireAuth,
  authorize(["OWNER", "ADMIN", "RECEPTION"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const { date, petId, status } = req.body ?? {};

      if (!date) return res.status(400).json({ error: "date é obrigatório." });

      const d = new Date(String(date));
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ error: "date inválido. Envie ISO string." });
      }

      let validatedPetId: string | null = null;

      if (petId) {
        const pet = await prisma.pet.findFirst({
          where: { id: String(petId), clinicId },
          select: { id: true },
        });

        if (!pet) {
          return res.status(404).json({ error: "Pet não encontrado nesta clínica." });
        }

        validatedPetId = pet.id;
      }

      const appt = await prisma.appointment.create({
        data: {
          clinicId,
          date: d,
          petId: validatedPetId,
          status: status ?? "SCHEDULED",
        },
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              tutor: { select: { id: true, name: true } },
            },
          },
        },
      });

      return res.status(201).json(appt);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar agendamento." });
    }
  }
);

appointmentsRouter.patch(
  "/:id/status",
  requireAuth,
  authorize(["OWNER", "ADMIN", "DOCTOR", "RECEPTION"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const id = String(req.params.id);
      const { status } = req.body ?? {};

      if (!status) return res.status(400).json({ error: "status é obrigatório." });

      const existing = await prisma.appointment.findFirst({
        where: { id, clinicId },
        select: { id: true },
      });

      if (!existing) {
        return res.status(404).json({ error: "Agendamento não encontrado nesta clínica." });
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: { status },
      });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao atualizar status." });
    }
  }
);


appointmentsRouter.patch(
  "/:id",
  requireAuth,
  authorize(["OWNER", "ADMIN", "RECEPTION"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const id = String(req.params.id);
      const { date, petId } = req.body ?? {};

      const existing = await prisma.appointment.findFirst({
        where: { id, clinicId },
        select: { id: true },
      });

      if (!existing) {
        return res.status(404).json({ error: "Agendamento não encontrado nesta clínica." });
      }

      const dataToUpdate: any = {};

      if (date !== undefined) {
        const d = new Date(String(date));
        if (Number.isNaN(d.getTime())) {
          return res.status(400).json({ error: "date inválido. Envie ISO string." });
        }
        dataToUpdate.date = d;
      }

      if (petId !== undefined) {
        if (petId === null || petId === "") {
          dataToUpdate.petId = null;
        } else {
          const pet = await prisma.pet.findFirst({
            where: { id: String(petId), clinicId },
            select: { id: true },
          });

          if (!pet) {
            return res.status(404).json({ error: "Pet não encontrado nesta clínica." });
          }

          dataToUpdate.petId = pet.id;
        }
      }

      const updated = await prisma.appointment.update({
        where: { id },
        data: dataToUpdate,
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              tutor: { select: { id: true, name: true } },
            },
          },
        },
      });

      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao atualizar agendamento." });
    }
  }
);


appointmentsRouter.delete(
  "/:id",
  requireAuth,
  authorize(["OWNER", "ADMIN"]),
  async (req, res) => {
    try {
      const clinicId = req.user!.clinicId;
      const id = String(req.params.id);

      const existing = await prisma.appointment.findFirst({
        where: { id, clinicId },
        select: { id: true },
      });

      if (!existing) {
        return res.status(404).json({ error: "Agendamento não encontrado nesta clínica." });
      }

      await prisma.appointment.delete({ where: { id } });
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao remover agendamento." });
    }
  }
);
