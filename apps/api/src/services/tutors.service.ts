import { prisma } from "../db/prisma.js";

export async function listTutors(clinicId: string) {
  return prisma.tutor.findMany({
    where: { clinicId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTutor(clinicId: string, input: { name: string; phone?: string; email?: string }) {
  if (!input.name?.trim()) return { error: "name é obrigatório." } as const;

  const tutor = await prisma.tutor.create({
    data: {
      clinicId,
      name: input.name.trim(),
      phone: input.phone ? String(input.phone).trim() : null,
      email: input.email ? String(input.email).trim().toLowerCase() : null,
    },
  });

  return tutor;
}
