import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { authorize } from "../middlewares/authorize.js";
import { authorizePerm } from "../middlewares/authorizePerm.js";


export const petsRouter = Router();

petsRouter.get("/", requireAuth, authorizePerm("PET_READ"), async (req, res) => {
  const clinicId = req.user!.clinicId;

  const pets = await prisma.pet.findMany({
    where: { clinicId },
    orderBy: { createdAt: "desc" },
    include: { tutor: { select: { id: true, name: true } } },
  });

  res.json(pets);
});

petsRouter.post("/", requireAuth, authorizePerm("PET_CREATE"), async (req, res) => {
  const clinicId = req.user!.clinicId;
  const { name, species, breed, tutorId } = req.body ?? {};

  if (!name || !species || !tutorId) {
    return res.status(400).json({ error: "name, species e tutorId são obrigatórios." });
  }

 
  const tutor = await prisma.tutor.findFirst({
    where: { id: String(tutorId), clinicId },
    select: { id: true },
  });

  if (!tutor) {
    return res.status(404).json({ error: "Tutor não encontrado nesta clínica." });
  }

  const pet = await prisma.pet.create({
    data: {
      clinicId,
      tutorId: tutor.id,
      name: String(name).trim(),
      species: String(species).trim(),
      breed: breed ? String(breed).trim() : null,
    },
  });

  res.status(201).json(pet);
});
