import { AppError } from "shared/errors/app-error.js";
import type { IUserRepository } from "../../users/repositories/user-repository.js";
import type { Doctor } from "../domain/doctor.js";
import type { CreateDoctorDTO } from "../dto/create-doctor.dto.js";
import type { IDoctorRepository } from "../repository/doctor.repository.js";

export class CreateDoctorService {
  constructor(
    private readonly doctorRepository: IDoctorRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateDoctorDTO): Promise<Doctor> {
    const user = await this.userRepository.getById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.role !== "DOCTOR") {
      throw new AppError("User is not a doctor", 400);
    }

    const existingDoctor = await this.doctorRepository.findByUserId(data.userId);

    if (existingDoctor) {
      throw new AppError("Doctor profile already exists for this user", 409);
    }

    return this.doctorRepository.createDoctor(data);
  }
}
