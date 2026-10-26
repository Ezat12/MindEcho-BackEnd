import type { Doctor } from "../domain/doctor.js";
import type { CreateDoctorDTO } from "../dto/create-doctor.dto.js";
import type { PaginationDoctorDTO } from "../dto/pagination-doctor.dto.js";
import type { UpdateDoctorDTO } from "../dto/update-doctor.dto.js";

export interface IDoctorRepository {
  createDoctor(data: CreateDoctorDTO): Promise<Doctor>;
  updateDoctor(id: string, data: UpdateDoctorDTO): Promise<Doctor>;
  getAllDoctors(
    query: PaginationDoctorDTO,
  ): Promise<{ doctors: Doctor[]; total: number }>;
  getDoctorById(id: string): Promise<Doctor | null>;
  findByUserId(userId: string): Promise<Doctor | null>;
  deleteDoctor(id: string): Promise<void>;
}
