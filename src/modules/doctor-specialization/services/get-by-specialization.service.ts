import { AppError } from "shared/errors/app-error.js";
import type { ISpecializationRepository } from "../../specializations/repository/specialization.repository.js";
import type { DoctorSpecialization } from "../domain/doctor-specialization.js";
import type { IDoctorSpecializationRepository } from "../repository/doctor-specialization.repository.js";

export class GetDoctorsBySpecializationService {
  constructor(
    private readonly doctorSpecializationRepository: IDoctorSpecializationRepository,
    private readonly specializationRepository: ISpecializationRepository,
  ) {}

  async execute(specializationId: string): Promise<DoctorSpecialization[]> {
    const specialization =
      await this.specializationRepository.getSpecializationById(
        specializationId,
      );

    if (!specialization) {
      throw new AppError("Specialization not found", 404);
    }

    return this.doctorSpecializationRepository.getBySpecializationId(
      specializationId,
    );
  }
}
