import bcrypt from "bcrypt";

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
