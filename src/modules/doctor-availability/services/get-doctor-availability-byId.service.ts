import { AppError } from "shared/errors/app-error.js";
import type { DoctorAvailability } from "../domain/doctor-availability.js";
import type { IDoctorAvailabilityRepository } from "../repository/doctor-availability.repository.js";

export class GetDoctorAvailabilityByIdService {
  constructor(
    private readonly doctorAvailabilityRepository: IDoctorAvailabilityRepository,
  ) {}

  async execute(availabilityId: string): Promise<DoctorAvailability> {
    const doctorAvailability =
      await this.doctorAvailabilityRepository.getDoctorAvailabilityById(
        availabilityId,
      );

    if (!doctorAvailability) {
      throw new AppError("Doctor availability not found", 404);
    }

    return doctorAvailability;
  }
}
