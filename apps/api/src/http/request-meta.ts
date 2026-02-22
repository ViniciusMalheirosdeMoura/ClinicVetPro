import type { Request } from "express";

export function getClientIp(req: Request) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length > 0) return xf.split(",")[0]!.trim();
  return (req.ip || "0.0.0.0") as string;
}

export function getUserAgent(req: Request) {
  return req.get("user-agent") ?? null;
}
