import type { IDoctorRepository } from "modules/doctors/repository/doctor.repository.js";
import type { DoctorAvailability } from "../domain/doctor-availability.js";
import type { IDoctorAvailabilityRepository } from "../repository/doctor-availability.repository.js";
import { AppError } from "shared/errors/app-error.js";

export class GetMyDoctorAvailabilityService {
  constructor(
    private readonly doctorAvailabilityRepository: IDoctorAvailabilityRepository,
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(doctorUserId: string): Promise<DoctorAvailability[]> {
    const exitingDoctor =
      await this.doctorRepository.findByUserId(doctorUserId);

    if (!exitingDoctor) {
      throw new AppError("Doctor not found", 404);
    }

    const doctorAvailability =
      await this.doctorAvailabilityRepository.getDoctorAvailabilityByDoctorId(
        exitingDoctor.id,
      );

    return doctorAvailability;
  }
}
