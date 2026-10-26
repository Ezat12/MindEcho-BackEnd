import type { DoctorSpecialization } from "../domain/doctor-specialization.js";
import type { AssignSpecializationDTO } from "../dto/assign-specialization.dto.js";

export interface IDoctorSpecializationRepository {
  assign(
    data: AssignSpecializationDTO,
  ): Promise<DoctorSpecialization>;
  findById(id: string): Promise<DoctorSpecialization | null>;
  findByDoctorAndSpecialization(
    doctorId: string,
    specializationId: string,
  ): Promise<DoctorSpecialization | null>;
  getByDoctorId(doctorId: string): Promise<DoctorSpecialization[]>;
  getBySpecializationId(
    specializationId: string,
  ): Promise<DoctorSpecialization[]>;
  remove(id: string): Promise<void>;
}
