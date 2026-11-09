import type { DoctorAvailability } from ".prisma/client/index.js";
import type { CreateDoctorAvailabilityInput } from "modules/doctor-availability/dto/create-doctor-availability.schema.js";
import type { IDoctorAvailabilityRepository } from "modules/doctor-availability/repository/doctor-availability.repository.js";
import type { Role } from "@prisma/client";
import type { IDoctorRepository } from "modules/doctors/repository/doctor.repository.js";
import { AppError } from "shared/errors/app-error.js";

export class CreateDoctorAvailabilityService {
  constructor(
    private readonly doctorAvailabilityRepository: IDoctorAvailabilityRepository,
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(
    data: CreateDoctorAvailabilityInput,
    userId: string,
    role: Role,
  ): Promise<DoctorAvailability> {
    const doctor = await this.doctorRepository.getDoctorById(data.doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    if (role !== "ADMIN" && doctor.userId.toString() !== userId.toString()) {
      throw new AppError(
        "Unauthorized to create availability for this doctor",
        403,
      );
    }

    const existingAvailability =
      await this.doctorAvailabilityRepository.getDoctorAvailabilityByDay(
        data.doctorId,
        data.dayOfWeek,
      );

    const formatTime = (date: Date): string => {
      return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
        date.getUTCMinutes(),
      ).padStart(2, "0")}`;
    };

    const hasOverlap = existingAvailability.some(
      (item) =>
        data.startTime < formatTime(item.endTime) &&
        data.endTime > formatTime(item.startTime),
    );

    if (hasOverlap) {
      throw new AppError(
        "Doctor availability for this day has overlapping time slots",
        400,
      );
    }

    const createdAvailability =
      await this.doctorAvailabilityRepository.createDoctorAvailability(data);

    return createdAvailability;
  }
}
