import type { Specialization } from "../domain/specialization.js";
import type { CreateSpecializationDTO } from "../dto/create-specialization.dto.js";
import type { UpdateSpecializationDTO } from "../dto/update-specialization.dto.js";

export interface ISpecializationRepository {
  createSpecialization(
    data: CreateSpecializationDTO,
    slug: string,
  ): Promise<Specialization>;
  updateSpecialization(
    id: string,
    data: UpdateSpecializationDTO,
    slug?: string | undefined,
  ): Promise<Specialization>;
  getAllSpecializations(): Promise<Specialization[]>;
  getSpecializationById(id: string): Promise<Specialization | null>;
  findByName(name: string): Promise<Specialization | null>;
  findBySlug(slug: string): Promise<Specialization | null>;
  deleteSpecialization(id: string): Promise<void>;
}
