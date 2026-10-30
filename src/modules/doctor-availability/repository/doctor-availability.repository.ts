import type { DoctorAvailability } from "../domain/doctor-availability.js";
import type { CreateDoctorAvailabilityInput } from "../dto/create-doctor-availability.schema.js";
import type { UpdateDoctorAvailabilityInput } from "../dto/update-doctor-availability.schema.js";

export interface IDoctorAvailabilityRepository {
  createDoctorAvailability(
    data: CreateDoctorAvailabilityInput,
  ): Promise<DoctorAvailability>;

  getDoctorAvailabilityById(id: string): Promise<DoctorAvailability | null>;

  getDoctorAvailabilityByDoctorId(
    doctorId: string,
  ): Promise<DoctorAvailability[]>;

  updateDoctorAvailability(
    id: string,
    data: UpdateDoctorAvailabilityInput,
  ): Promise<DoctorAvailability>;

  deleteDoctorAvailability(id: string): Promise<void>;
}
