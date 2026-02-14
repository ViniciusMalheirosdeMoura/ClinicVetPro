import { prisma } from "../db/prisma.js";
import { hashPassword } from "../auth/password.js";
import { comparePassword } from "../auth/compare.js";
import { signAccessToken } from "../auth/jwt.js";

export async function registerOwner(input: {
  clinicName: string;
  name: string;
  email: string;
  password: string;
}) {
  const clinicName = String(input.clinicName).trim();
  const name = String(input.name).trim();
  const email = String(input.email).trim().toLowerCase();
  const password = String(input.password);

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email } });
    if (existing) return { error: "E-mail já cadastrado." } as const;

    const clinic = await tx.clinic.create({ data: { name: clinicName } });

    const user = await tx.user.create({
      data: { name, email, password: await hashPassword(password) },
    });

    const member = await tx.clinicMember.create({
      data: { clinicId: clinic.id, userId: user.id, role: "OWNER" },
    });

    const token = signAccessToken({
      userId: user.id,
      clinicId: clinic.id,
      role: member.role,
    });

    return { clinic, user: { id: user.id, name: user.name, email: user.email }, token } as const;
  });

  return result;
}

export async function login(input: { email: string; password: string }) {
  const email = String(input.email).trim().toLowerCase();
  const password = String(input.password);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  });

  if (!user) return { error: "Credenciais inválidas." } as const;

  const ok = await comparePassword(password, user.password);
  if (!ok) return { error: "Credenciais inválidas." } as const;

  const membership = await prisma.clinicMember.findFirst({
    where: { userId: user.id },
    select: { clinicId: true, role: true },
    orderBy: { role: "asc" },
  });

  if (!membership) return { error: "Usuário não está vinculado a nenhuma clínica." } as const;

  const token = signAccessToken({
    userId: user.id,
    clinicId: membership.clinicId,
    role: membership.role,
  });

  return {
    user: { id: user.id, name: user.name, email: user.email },
    clinicId: membership.clinicId,
    role: membership.role,
    token,
  } as const;
}
