import { randomBytes } from "crypto";

export function generateRefreshToken() {
  return randomBytes(32).toString("hex");
}
