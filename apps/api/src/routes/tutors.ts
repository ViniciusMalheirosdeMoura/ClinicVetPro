import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import { authorizePerm } from "../middlewares/authorizePerm.js";

export const tutorsRouter = Router();

tutorsRouter.get("/", requireAuth, authorizePerm("TUTOR_READ"), async (req, res) => {
  const clinicId = req.user!.clinicId;

  const tutors = await prisma.tutor.findMany({
    where: { clinicId },
    orderBy: { createdAt: "desc" },
  });

  res.json(tutors);
});

tutorsRouter.post("/", requireAuth, authorizePerm("TUTOR_CREATE"), async (req, res) => {

  const clinicId = req.user!.clinicId;
  const { name, phone, email } = req.body ?? {};

  if (!name) return res.status(400).json({ error: "name é obrigatório." });

  const tutor = await prisma.tutor.create({
    data: {
      clinicId,
      name: String(name).trim(),
      phone: phone ? String(phone).trim() : null,
      email: email ? String(email).trim().toLowerCase() : null,
    },
  });

  res.status(201).json(tutor);
});
