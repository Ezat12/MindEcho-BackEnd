import { AppError } from "shared/errors/app-error.js";
import type { IDoctorSpecializationRepository } from "../repository/doctor-specialization.repository.js";

export class RemoveSpecializationByPairService {
  constructor(
    private readonly doctorSpecializationRepository: IDoctorSpecializationRepository,
  ) {}

  async execute(doctorId: string, specializationId: string): Promise<void> {
    const exist =
      await this.doctorSpecializationRepository.findByDoctorAndSpecialization(
        doctorId,
        specializationId,
      );

    if (!exist) {
      throw new AppError("Doctor specialization not found", 404);
    }

    await this.doctorSpecializationRepository.remove(exist.id);
  }
}
