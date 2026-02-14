import type { Request, Response } from "express";
import { login, registerOwner, selectClinic } from "../services/auth.service.js";

export async function registerOwnerController(req: Request, res: Response) {
  const { clinicName, name, email, password } = req.body ?? {};
  if (!clinicName || !name || !email || !password) {
    return res.status(400).json({ error: "clinicName, name, email e password são obrigatórios." });
  }

  try {
    const result = await registerOwner({ clinicName, name, email, password });
    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno ao registrar dono." });
  }
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: "email e password são obrigatórios." });

  try {
    const result = await login({ email, password });
    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao fazer login." });
  }
}

export async function selectClinicController(req: Request, res: Response) {
  const { email, password, clinicId } = req.body ?? {};
  if (!email || !password || !clinicId) {
    return res.status(400).json({ error: "email, password e clinicId são obrigatórios." });
  }

  try {
    const result = await selectClinic({ email, password, clinicId });
    if (!result.ok) return res.status(result.code).json({ error: result.error });
    return res.json(result.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao selecionar clínica." });
  }
}
