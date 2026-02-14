import { prisma } from "../db/prisma.js";

export async function listPets(clinicId: string) {
  return prisma.pet.findMany({
    where: { clinicId },
    orderBy: { createdAt: "desc" },
    include: { tutor: { select: { id: true, name: true } } },
  });
}

export async function createPet(
  clinicId: string,
  input: { name: string; species: string; breed?: string; tutorId: string }
) {
  const name = String(input.name ?? "").trim();
  const species = String(input.species ?? "").trim();
  const tutorId = String(input.tutorId ?? "").trim();
  const breed = input.breed ? String(input.breed).trim() : null;

  if (!name || !species || !tutorId) {
    return { error: "name, species e tutorId são obrigatórios." } as const;
  }

  // garante que o tutor pertence à clínica
  const tutor = await prisma.tutor.findFirst({
    where: { id: tutorId, clinicId },
    select: { id: true },
  });

  if (!tutor) {
    return { error: "Tutor não encontrado nesta clínica." } as const;
  }

  const pet = await prisma.pet.create({
    data: {
      clinicId,
      tutorId: tutor.id,
      name,
      species,
      breed,
    },
  });

  return pet;
}
