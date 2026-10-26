import { AppError } from "shared/errors/app-error.js";
import type { IDoctorRepository } from "../../doctors/repository/doctor.repository.js";
import type { ISpecializationRepository } from "../../specializations/repository/specialization.repository.js";
import type { DoctorSpecialization } from "../domain/doctor-specialization.js";
import type { AssignSpecializationDTO } from "../dto/assign-specialization.dto.js";
import type { IDoctorSpecializationRepository } from "../repository/doctor-specialization.repository.js";

export class AssignSpecializationService {
  constructor(
    private readonly doctorSpecializationRepository: IDoctorSpecializationRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly specializationRepository: ISpecializationRepository,
  ) {}

  async execute(data: AssignSpecializationDTO): Promise<DoctorSpecialization> {
    const doctor = await this.doctorRepository.getDoctorById(data.doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    const specialization =
      await this.specializationRepository.getSpecializationById(
        data.specializationId,
      );

    if (!specialization) {
      throw new AppError("Specialization not found", 404);
    }

    const existing =
      await this.doctorSpecializationRepository.findByDoctorAndSpecialization(
        data.doctorId,
        data.specializationId,
      );

    if (existing) {
      throw new AppError("Specialization already assigned to this doctor", 409);
    }

    return this.doctorSpecializationRepository.assign(data);
  }
}
