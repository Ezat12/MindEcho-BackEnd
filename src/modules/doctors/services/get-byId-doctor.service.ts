import { AppError } from "shared/errors/app-error.js";
import type { Doctor } from "../domain/doctor.js";
import type { IDoctorRepository } from "../repository/doctor.repository.js";

export class GetDoctorByIdService {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async execute(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepository.getDoctorById(id);

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    return doctor;
  }
}
