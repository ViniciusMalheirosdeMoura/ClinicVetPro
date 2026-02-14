import type { Request, Response } from "express";
import { login, registerOwner } from "../services/auth.service.js";

export async function registerOwnerController(req: Request, res: Response) {
  const { clinicName, name, email, password } = req.body ?? {};
  if (!clinicName || !name || !email || !password) {
    return res.status(400).json({ error: "clinicName, name, email e password são obrigatórios." });
  }

  try {
    const result = await registerOwner({ clinicName, name, email, password });
    if ("error" in result) return res.status(409).json(result);
    return res.status(201).json(result);
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
    if ("error" in result) return res.status(401).json(result);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao fazer login." });
  }
}
