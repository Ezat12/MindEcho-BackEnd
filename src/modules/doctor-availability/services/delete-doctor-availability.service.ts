import { AppError } from "shared/errors/app-error.js";
import type { Role } from "@prisma/client";
import type { IDoctorRepository } from "modules/doctors/repository/doctor.repository.js";
import type { IDoctorAvailabilityRepository } from "../repository/doctor-availability.repository.js";

export class DeleteDoctorAvailabilityService {
  constructor(
    private readonly doctorAvailabilityRepository: IDoctorAvailabilityRepository,
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(id: string, userId: string, role: Role): Promise<void> {
    // 1. Check if availability exists
    const availability =
      await this.doctorAvailabilityRepository.getDoctorAvailabilityById(id);

    if (!availability) {
      throw new AppError("Doctor availability not found", 404);
    }

    // 2. Get the doctor
    const doctor = await this.doctorRepository.getDoctorById(
      availability.doctorId,
    );

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    // 3. Check permissions
    if (role !== "ADMIN" && doctor.userId !== userId) {
      throw new AppError(
        "Unauthorized to delete this doctor availability",
        403,
      );
    }

    // 4. Delete availability
    await this.doctorAvailabilityRepository.deleteDoctorAvailability(id);
  }
}
