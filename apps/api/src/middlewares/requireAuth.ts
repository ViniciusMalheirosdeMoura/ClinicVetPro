import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

type AuthUser = {
  userId: string;
  clinicId: string;
  role: "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTION";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente." });
  }

  const token = header.slice("Bearer ".length).trim();
  const secret = process.env.JWT_SECRET!;
  try {
    const payload = jwt.verify(token, secret) as AuthUser;
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
