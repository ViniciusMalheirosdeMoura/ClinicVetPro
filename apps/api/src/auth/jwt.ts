import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET!;
if (!secret) throw new Error("JWT_SECRET não configurado em apps/api/.env");

export type JwtPayload = {
  userId: string;
  clinicId: string;
  role: "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTION";
};

export function signAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, secret as string, { expiresIn: "1h" });
}
