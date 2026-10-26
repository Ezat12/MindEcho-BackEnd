import { AppError } from "shared/errors/app-error.js";
import type { IDoctorRepository } from "../../doctors/repository/doctor.repository.js";
import type { DoctorSpecialization } from "../domain/doctor-specialization.js";
import type { IDoctorSpecializationRepository } from "../repository/doctor-specialization.repository.js";

export class GetSpecializationsByDoctorService {
  constructor(
    private readonly doctorSpecializationRepository: IDoctorSpecializationRepository,
    private readonly doctorRepository: IDoctorRepository,
  ) {}

  async execute(doctorId: string): Promise<DoctorSpecialization[]> {
    const doctor = await this.doctorRepository.getDoctorById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    return this.doctorSpecializationRepository.getByDoctorId(doctorId);
  }
}
