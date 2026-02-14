import { prisma } from "../db/prisma.js";
import type { ServiceResult } from "../types/service-result.js";
import { ok, err } from "../types/service-result.js";

type Role = "OWNER" | "ADMIN" | "DOCTOR" | "RECEPTION";

export async function listMembers(clinicId: string): Promise<ServiceResult<any[]>> {
  const members = await prisma.clinicMember.findMany({
    where: { clinicId },
    orderBy: { role: "asc" },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });

  return ok(members);
}

export async function updateMemberRole(input: {
  clinicId: string;
  memberId: string;
  newRole: Role;
  actorUserId: string;
}): Promise<ServiceResult<any>> {
  const memberId = String(input.memberId ?? "").trim();
  const newRole = input.newRole;

  if (!memberId || !newRole) return err(400, "memberId e role são obrigatórios.");

  const member = await prisma.clinicMember.findFirst({
    where: { id: memberId, clinicId: input.clinicId },
    select: { id: true, userId: true, role: true },
  });

  if (!member) return err(404, "Membro não encontrado.");

  if (member.userId === input.actorUserId && newRole !== "OWNER") {
    return err(409, "Você não pode alterar seu próprio papel de OWNER.");
  }

  const updated = await prisma.clinicMember.update({
    where: { id: member.id },
    data: { role: newRole },
  });

  return ok(updated);
}

export async function removeMember(input: {
  clinicId: string;
  memberId: string;
  actorUserId: string;
}): Promise<ServiceResult<null>> {
  const memberId = String(input.memberId ?? "").trim();
  if (!memberId) return err(400, "memberId é obrigatório.");

  const member = await prisma.clinicMember.findFirst({
    where: { id: memberId, clinicId: input.clinicId },
    select: { id: true, userId: true, role: true },
  });

  if (!member) return err(404, "Membro não encontrado.");

  if (member.userId === input.actorUserId) {
    return err(409, "Você não pode remover a si mesmo.");
  }

  await prisma.clinicMember.delete({ where: { id: member.id } });
  return ok(null);
}
