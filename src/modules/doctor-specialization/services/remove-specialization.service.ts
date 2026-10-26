import { AppError } from "shared/errors/app-error.js";
import type { IDoctorSpecializationRepository } from "../repository/doctor-specialization.repository.js";

export class RemoveSpecializationService {
  constructor(
    private readonly doctorSpecializationRepository: IDoctorSpecializationRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exist = await this.doctorSpecializationRepository.findById(id);

    if (!exist) {
      throw new AppError("Doctor specialization not found", 404);
    }

    await this.doctorSpecializationRepository.remove(id);
  }
}
