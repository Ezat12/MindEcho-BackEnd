import type { Doctor } from "../../doctors/domain/doctor.js";
import type { Specialization } from "../../specializations/domain/specialization.js";

export interface DoctorSpecialization {
  id: string;
  doctorId: string;
  specializationId: string;
  doctor?: Doctor;
  specialization?: Specialization;
}
