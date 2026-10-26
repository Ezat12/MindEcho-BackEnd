import { AppError } from "shared/errors/app-error.js";
import type { Doctor } from "../domain/doctor.js";
import type { UpdateDoctorDTO } from "../dto/update-doctor.dto.js";
import type { IDoctorRepository } from "../repository/doctor.repository.js";

export class UpdateDoctorService {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async execute(id: string, data: UpdateDoctorDTO): Promise<Doctor> {
    const exist = await this.doctorRepository.getDoctorById(id);

    if (!exist) {
      throw new AppError("Doctor not found", 404);
    }

    return this.doctorRepository.updateDoctor(id, data);
  }
}
