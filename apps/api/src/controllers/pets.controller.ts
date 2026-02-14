import type { Request, Response } from "express";
import { createPet, listPets } from "../services/pets.service.js";

export async function listPetsController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const pets = await listPets(clinicId);
    return res.json(pets);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar pets." });
  }
}

export async function createPetController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const { name, species, breed, tutorId } = req.body ?? {};

    const result = await createPet(clinicId, {
      name,
      species,
      breed,
      tutorId,
    });

    if ("error" in result) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar pet." });
  }
}
