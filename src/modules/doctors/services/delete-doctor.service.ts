import { AppError } from "shared/errors/app-error.js";
import type { IDoctorRepository } from "../repository/doctor.repository.js";

export class DeleteDoctorService {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async execute(id: string): Promise<void> {
    const exist = await this.doctorRepository.getDoctorById(id);

    if (!exist) {
      throw new AppError("Doctor not found", 404);
    }

    await this.doctorRepository.deleteDoctor(id);
  }
}
