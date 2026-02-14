import type { Request, Response } from "express";
import { createTutor, listTutors } from "../services/tutors.service.js";

export async function listTutorsController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const tutors = await listTutors(clinicId);
    return res.json(tutors);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar tutores." });
  }
}

export async function createTutorController(req: Request, res: Response) {
  try {
    const clinicId = req.user!.clinicId;
    const { name, phone, email } = req.body ?? {};

    const result = await createTutor(clinicId, {
      name: String(name ?? ""),
      phone,
      email,
    });

    if ("error" in result) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar tutor." });
  }
}
