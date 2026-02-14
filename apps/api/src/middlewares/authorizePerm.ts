import type { Request, Response, NextFunction } from "express";
import { rolePermissions, type Permission, type Role } from "../auth/permissions.js";

export function authorizePerm(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Não autenticado." });

    const role = user.role as Role;
    const allowed = rolePermissions[role] ?? [];

    if (!allowed.includes(permission)) {
      return res.status(403).json({ error: "Sem permissão para esta ação." });
    }

    return next();
  };
}
