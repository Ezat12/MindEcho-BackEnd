import type { Doctor } from "../domain/doctor.js";
import type { PaginationDoctorDTO } from "../dto/pagination-doctor.dto.js";
import type { IDoctorRepository } from "../repository/doctor.repository.js";

export class GetAllDoctorsService {
  constructor(private readonly doctorRepository: IDoctorRepository) {}

  async execute(
    query: PaginationDoctorDTO,
  ): Promise<{ doctors: Doctor[]; total: number; totalPages: number }> {
    const { doctors, total } = await this.doctorRepository.getAllDoctors(query);
    const totalPages = Math.ceil(total / query.limit);

    return { doctors, total, totalPages };
  }
}
