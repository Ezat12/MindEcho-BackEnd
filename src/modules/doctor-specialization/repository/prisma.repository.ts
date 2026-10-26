import { prisma } from "config/prisma.js";
import type { Prisma } from "@prisma/client";
import type { DoctorSpecialization } from "../domain/doctor-specialization.js";
import type { AssignSpecializationDTO } from "../dto/assign-specialization.dto.js";
import type { IDoctorSpecializationRepository } from "./doctor-specialization.repository.js";

type DoctorSpecializationWithRelations = Prisma.DoctorSpecializationGetPayload<{
  include: {
    doctor: true;
    specialization: true;
  };
}>;

const relationInclude = {
  specialization: true,
  doctor: true,
} as const;

const toDoctorSpecialization = (
  row: DoctorSpecializationWithRelations,
): DoctorSpecialization => {
  return {
    id: row.id,
    doctorId: row.doctorId,
    specializationId: row.specializationId,
    ...(row.doctor !== undefined && {
      doctor: {
        ...row.doctor,
        price: Number(row.doctor.price),
      },
    }),
    ...(row.specialization !== undefined && {
      specialization: row.specialization,
    }),
  };
};

export class PrismaDoctorSpecializationRepository implements IDoctorSpecializationRepository {
  async assign(data: AssignSpecializationDTO): Promise<DoctorSpecialization> {
    const relation = await prisma.doctorSpecialization.create({
      data: {
        doctorId: data.doctorId,
        specializationId: data.specializationId,
      },
      include: relationInclude,
    });

    return toDoctorSpecialization(relation);
  }

  async findById(id: string): Promise<DoctorSpecialization | null> {
    const relation = await prisma.doctorSpecialization.findUnique({
      where: { id },
      include: relationInclude,
    });

    return relation ? toDoctorSpecialization(relation) : null;
  }

  async findByDoctorAndSpecialization(
    doctorId: string,
    specializationId: string,
  ): Promise<DoctorSpecialization | null> {
    const relation = await prisma.doctorSpecialization.findUnique({
      where: {
        doctorId_specializationId: {
          doctorId,
          specializationId,
        },
      },
      include: relationInclude,
    });

    return relation ? toDoctorSpecialization(relation) : null;
  }

  async getByDoctorId(doctorId: string): Promise<DoctorSpecialization[]> {
    const relations = await prisma.doctorSpecialization.findMany({
      where: { doctorId },
      include: relationInclude,
    });

    return relations.map(toDoctorSpecialization);
  }

  async getBySpecializationId(
    specializationId: string,
  ): Promise<DoctorSpecialization[]> {
    const relations = await prisma.doctorSpecialization.findMany({
      where: { specializationId },
      include: relationInclude,
    });

    return relations.map(toDoctorSpecialization);
  }

  async remove(id: string): Promise<void> {
    await prisma.doctorSpecialization.delete({
      where: { id },
    });
  }
}
