import { randomBytes } from "crypto";
import { prisma } from "../db/prisma.js";
import { hashPassword } from "../auth/password.js";
import { signAccessToken } from "../auth/jwt.js";
import type { ServiceResult } from "../types/service-result.js";
import { ok, err } from "../types/service-result.js";

type Role = "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTION";

function makeToken() {
  return randomBytes(24).toString("hex");
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export async function listInvites(clinicId: string): Promise<ServiceResult<any[]>> {
  const invites = await prisma.invite.findMany({
    where: { clinicId },
    orderBy: { expiresAt: "desc" },
  });

  return ok(invites);
}

export async function createInvite(input: {
  clinicId: string;
  email: string;
  role: Role;
  daysValid?: number;
}): Promise<ServiceResult<{ invite: any; link: string }>> {
  const email = String(input.email ?? "").trim().toLowerCase();
  const role = input.role;

  if (!email || !role) return err(400, "email e role são obrigatórios.");

  const token = makeToken();
  const expiresAt = addDays(new Date(), Number(input.daysValid ?? 7));

  const invite = await prisma.invite.create({
    data: {
      clinicId: input.clinicId,
      email,
      role,
      token,
      expiresAt,
    },
  });

  const link = `/invite/${invite.token}`;
  return ok({ invite, link });
}

export async function validateInvite(token: string): Promise<
  ServiceResult<{
    clinic: { id: string; name: string };
    email: string;
    role: Role;
    expiresAt: Date;
  }>
> {
  const invite = await prisma.invite.findUnique({
    where: { token: String(token) },
    include: { clinic: { select: { id: true, name: true } } },
  });

  if (!invite) return err(404, "Convite não encontrado.");
  if (invite.usedAt) return err(409, "Convite já utilizado.");
  if (invite.expiresAt.getTime() < Date.now()) return err(410, "Convite expirado.");

  return ok({
    clinic: invite.clinic,
    email: invite.email,
    role: invite.role as Role,
    expiresAt: invite.expiresAt,
  });
}

export async function acceptInvite(input: {
  token: string;
  name: string;
  password: string;
}): Promise<
  ServiceResult<{
    user: { id: string; name: string; email: string };
    clinicId: string;
    role: Role;
    token: string;
  }>
> {
  const token = String(input.token ?? "").trim();
  const name = String(input.name ?? "").trim();
  const password = String(input.password ?? "");

  if (!token || !name || !password) {
    return err(400, "token, name e password são obrigatórios.");
  }

  const invite = await prisma.invite.findUnique({ where: { token } });

  if (!invite) return err(404, "Convite não encontrado.");
  if (invite.usedAt) return err(409, "Convite já utilizado.");
  if (invite.expiresAt.getTime() < Date.now()) return err(410, "Convite expirado.");

  const existingUser = await prisma.user.findUnique({
    where: { email: invite.email },
    select: { id: true },
  });

  if (existingUser) {
    return err(409, "Já existe um usuário com este e-mail. Faça login.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email: invite.email,
        password: await hashPassword(password),
      },
    });

    const member = await tx.clinicMember.create({
      data: {
        clinicId: invite.clinicId,
        userId: user.id,
        role: invite.role,
      },
    });

    await tx.invite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() },
    });

    const accessToken = signAccessToken({
      userId: user.id,
      clinicId: member.clinicId,
      role: member.role,
    });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      clinicId: member.clinicId,
      role: member.role as Role,
      token: accessToken,
    };
  });

  return ok(result);
}

export async function revokeInvite(input: {
  clinicId: string;
  inviteId: string;
}): Promise<ServiceResult<null>> {
  const inviteId = String(input.inviteId ?? "").trim();
  if (!inviteId) return err(400, "inviteId é obrigatório.");

  const invite = await prisma.invite.findFirst({
    where: { id: inviteId, clinicId: input.clinicId },
    select: { id: true, usedAt: true },
  });

  if (!invite) return err(404, "Convite não encontrado.");
  if (invite.usedAt) return err(409, "Convite já foi utilizado.");

  await prisma.invite.delete({ where: { id: inviteId } });

  return ok(null);
}
