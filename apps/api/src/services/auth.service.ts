import { prisma } from "../db/prisma.js";
import { hashPassword } from "../auth/password.js";
import { comparePassword } from "../auth/compare.js";
import { signAccessToken } from "../auth/jwt.js";
import type { ServiceResult } from "../types/service-result.js";
import { ok, err } from "../types/service-result.js";

type Role = "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTION";

export async function registerOwner(input: {
  clinicName: string;
  name: string;
  email: string;
  password: string;
}): Promise<
  ServiceResult<{
    clinic: any;
    user: { id: string; name: string; email: string };
    token: string;
  }>
> {
  const clinicName = String(input.clinicName).trim();
  const name = String(input.name).trim();
  const email = String(input.email).trim().toLowerCase();
  const password = String(input.password);

  if (!clinicName || !name || !email || !password) {
    return err(400, "clinicName, name, email e password são obrigatórios.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email } });
    if (existing) return null;

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

    return { clinic, user: { id: user.id, name: user.name, email: user.email }, token };
  });

  if (!result) return err(409, "E-mail já cadastrado.");

  return ok(result);
}

export async function login(input: { email: string; password: string }): Promise<
  ServiceResult<
    | {
        requiresClinicSelection: true;
        user: { id: string; name: string; email: string };
        clinics: { clinicId: string; clinicName: string; role: Role }[];
      }
    | {
        requiresClinicSelection: false;
        user: { id: string; name: string; email: string };
        clinicId: string;
        role: Role;
        token: string;
      }
  >
> {
  const email = String(input.email).trim().toLowerCase();
  const password = String(input.password);

  if (!email || !password) return err(400, "email e password são obrigatórios.");

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  });

  if (!user) return err(401, "Credenciais inválidas.");

  const passOk = await comparePassword(password, user.password);
  if (!passOk) return err(401, "Credenciais inválidas.");

  const memberships = await prisma.clinicMember.findMany({
    where: { userId: user.id },
    select: {
      clinicId: true,
      role: true,
      clinic: { select: { name: true } },
    },
    orderBy: { clinicId: "asc" },
  });

  if (memberships.length === 0) {
    return err(403, "Usuário não está vinculado a nenhuma clínica.");
  }

  const baseUser = { id: user.id, name: user.name, email: user.email };

  // multi-clínica: exige seleção
  if (memberships.length > 1) {
    return ok({
      requiresClinicSelection: true,
      user: baseUser,
      clinics: memberships.map((m) => ({
        clinicId: m.clinicId,
        clinicName: m.clinic.name,
        role: m.role as Role,
      })),
    });
  }

  // apenas 1 clínica: token direto
  const m = memberships[0];

if (!m) {
  return err(500, "Erro interno: membership não encontrado.");
}


  const token = signAccessToken({
    userId: user.id,
    clinicId: m.clinicId,
    role: m.role,
  });

  return ok({
    requiresClinicSelection: false,
    user: baseUser,
    clinicId: m.clinicId,
    role: m.role as Role,
    token,
  });
}

export async function selectClinic(input: {
  email: string;
  password: string;
  clinicId: string;
}): Promise<
  ServiceResult<{
    user: { id: string; name: string; email: string };
    clinicId: string;
    role: Role;
    token: string;
  }>
> {
  const email = String(input.email).trim().toLowerCase();
  const password = String(input.password);
  const clinicId = String(input.clinicId).trim();

  if (!email || !password || !clinicId) return err(400, "email, password e clinicId são obrigatórios.");

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  });

  if (!user) return err(401, "Credenciais inválidas.");

  const passOk = await comparePassword(password, user.password);
  if (!passOk) return err(401, "Credenciais inválidas.");

  const member = await prisma.clinicMember.findFirst({
    where: { userId: user.id, clinicId },
    select: { clinicId: true, role: true },
  });

  if (!member) return err(403, "Você não tem acesso a esta clínica.");

  const token = signAccessToken({
    userId: user.id,
    clinicId: member.clinicId,
    role: member.role,
  });

  return ok({
    user: { id: user.id, name: user.name, email: user.email },
    clinicId: member.clinicId,
    role: member.role as Role,
    token,
  });
}
