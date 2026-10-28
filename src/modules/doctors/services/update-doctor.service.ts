import { AppError } from "shared/errors/app-error.js";
import type { Doctor } from "../domain/doctor.js";
import type { UpdateDoctorDTO } from "../dto/update-doctor.dto.js";
import type { IDoctorRepository } from "../repository/doctor.repository.js";
import type { Role } from "@prisma/client";

export class UpdateDoctorService {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async execute(
    id: string,
    userId: string,
    role: Role,
    data: UpdateDoctorDTO,
  ): Promise<Doctor> {
    const exist = await this.doctorRepository.getDoctorById(id);

    if (!exist) {
      throw new AppError("Doctor not found", 404);
    }

    if (exist.userId !== userId && role !== "ADMIN") {
      throw new AppError("You are not authorized to update this doctor", 403);
    }

    return this.doctorRepository.updateDoctor(id, data);
  }
}
