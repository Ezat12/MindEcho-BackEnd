import type { DoctorAvailability } from "../domain/doctor-availability.js";
import type { UpdateDoctorAvailabilityInput } from "../dto/update-doctor-availability.schema.js";
import type { IDoctorAvailabilityRepository } from "../repository/doctor-availability.repository.js";
import type { IDoctorRepository } from "modules/doctors/repository/doctor.repository.js";
import type { Role } from "@prisma/client";
import { AppError } from "shared/errors/app-error.js";

export class UpdateDoctorAvailabilityService {
  constructor(
    private readonly doctorAvailabilityRepository: IDoctorAvailabilityRepository,
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateDoctorAvailabilityInput,
    userId: string,
    role: Role,
  ): Promise<DoctorAvailability> {
    // 1. Check if availability exists
    const availability =
      await this.doctorAvailabilityRepository.getDoctorAvailabilityById(id);

    if (!availability) {
      throw new AppError("Doctor availability not found", 404);
    }

    // 2. Get doctor
    const doctor = await this.doctorRepository.getDoctorById(
      availability.doctorId,
    );

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    // 3. Check permissions
    if (role !== "ADMIN" && doctor.userId !== userId) {
      throw new AppError(
        "Unauthorized to update this doctor availability",
        403,
      );
    }

    // 4. Merge existing data with updated data
    const updatedDayOfWeek = data.dayOfWeek ?? availability.dayOfWeek;

    const formatTime = (date: Date): string => {
      return `${String(date.getUTCHours()).padStart(2, "0")}:${String(
        date.getUTCMinutes(),
      ).padStart(2, "0")}`;
    };

    const updatedStartTime =
      data.startTime ?? formatTime(availability.startTime);

    const updatedEndTime = data.endTime ?? formatTime(availability.endTime);

    // 5. Validate time range
    if (updatedStartTime >= updatedEndTime) {
      throw new AppError("Start time must be before end time", 400);
    }

    // 6. Check overlapping availability
    const existingAvailability =
      await this.doctorAvailabilityRepository.getDoctorAvailabilityByDay(
        availability.doctorId,
        updatedDayOfWeek,
      );

    const hasOverlap = existingAvailability
      .filter((item) => item.id !== id)
      .some((item) => {
        const existingStart = formatTime(item.startTime);
        const existingEnd = formatTime(item.endTime);

        return updatedStartTime < existingEnd && updatedEndTime > existingStart;
      });

    if (hasOverlap) {
      throw new AppError(
        "Doctor availability for this day has overlapping time slots",
        400,
      );
    }

    // 7. Update availability
    return this.doctorAvailabilityRepository.updateDoctorAvailability(id, data);
  }
}
