import { prisma } from "config/prisma.js";
import type { Specialization } from "../domain/specialization.js";
import type { CreateSpecializationDTO } from "../dto/create-specialization.dto.js";
import type { UpdateSpecializationDTO } from "../dto/update-specialization.dto.js";
import type { ISpecializationRepository } from "./specialization.repository.js";

export class PrismaSpecializationRepository implements ISpecializationRepository {
  async createSpecialization(
    data: CreateSpecializationDTO,
    slug: string,
  ): Promise<Specialization> {
    return prisma.specializations.create({
      data: {
        name: data.name,
        slug,
      },
    });
  }

  async updateSpecialization(
    id: string,
    data: UpdateSpecializationDTO,
    slug?: string,
  ): Promise<Specialization> {
    return prisma.specializations.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(slug !== undefined && { slug }),
      },
    });
  }

  async getAllSpecializations(): Promise<Specialization[]> {
    return prisma.specializations.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getSpecializationById(id: string): Promise<Specialization | null> {
    return prisma.specializations.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Specialization | null> {
    return prisma.specializations.findUnique({
      where: { name },
    });
  }

  async findBySlug(slug: string): Promise<Specialization | null> {
    return prisma.specializations.findUnique({
      where: { slug },
    });
  }

  async deleteSpecialization(id: string): Promise<void> {
    await prisma.specializations.delete({
      where: { id },
    });
  }
}
