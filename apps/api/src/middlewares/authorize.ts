import type { Request, Response, NextFunction } from "express";

type Role = "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTION";

export function authorize(allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autenticado." });

    if (!allowed.includes(user.role as Role)) {
      return res.status(403).json({ error: "Sem permissão para esta ação." });
    }

    return next();
  };
}
