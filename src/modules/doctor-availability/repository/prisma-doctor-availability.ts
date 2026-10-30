import { prisma } from "config/prisma.js";
import type { DoctorAvailability as PrismaDoctorAvailability } from "@prisma/client";
import type { DoctorAvailability } from "../domain/doctor-availability.js";
import type { CreateDoctorAvailabilityInput } from "../dto/create-doctor-availability.schema.js";
import type { UpdateDoctorAvailabilityInput } from "../dto/update-doctor-availability.schema.js";
import type { IDoctorAvailabilityRepository } from "./doctor-availability.repository.js";

export class PrismaDoctorAvailabilityRepository implements IDoctorAvailabilityRepository {
  private toDomain(data: PrismaDoctorAvailability): DoctorAvailability {
    return {
      id: data.id,
      doctorId: data.doctorId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async createDoctorAvailability(
    data: CreateDoctorAvailabilityInput,
  ): Promise<DoctorAvailability> {
    const availability = await prisma.doctorAvailability.create({
      data: {
        doctorId: data.doctorId,
        dayOfWeek: data.dayOfWeek,
        startTime: new Date(`1970-01-01T${data.startTime}`),
        endTime: new Date(`1970-01-01T${data.endTime}`),
      },
    });

    return this.toDomain(availability);
  }

  async getDoctorAvailabilityById(
    id: string,
  ): Promise<DoctorAvailability | null> {
    const availability = await prisma.doctorAvailability.findUnique({
      where: { id },
    });

    return availability ? this.toDomain(availability) : null;
  }

  async getDoctorAvailabilityByDoctorId(
    doctorId: string,
  ): Promise<DoctorAvailability[]> {
    const availabilities = await prisma.doctorAvailability.findMany({
      where: { doctorId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return availabilities.map((item) => this.toDomain(item));
  }

  async updateDoctorAvailability(
    id: string,
    data: UpdateDoctorAvailabilityInput,
  ): Promise<DoctorAvailability> {
    const availability = await prisma.doctorAvailability.update({
      where: { id },
      data: {
        ...(data.dayOfWeek !== undefined && {
          dayOfWeek: data.dayOfWeek,
        }),
        ...(data.startTime !== undefined && {
          startTime: new Date(`1970-01-01T${data.startTime}`),
        }),
        ...(data.endTime !== undefined && {
          endTime: new Date(`1970-01-01T${data.endTime}`),
        }),
      },
    });

    return this.toDomain(availability);
  }

  async deleteDoctorAvailability(id: string): Promise<void> {
    await prisma.doctorAvailability.delete({
      where: { id },
    });
  }
}
