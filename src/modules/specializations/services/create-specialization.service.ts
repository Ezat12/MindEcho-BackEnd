import { AppError } from "shared/errors/app-error.js";
import { generateSlug } from "utils/generate-slug.js";
import type { Specialization } from "../domain/specialization.js";
import type { CreateSpecializationDTO } from "../dto/create-specialization.dto.js";
import type { ISpecializationRepository } from "../repository/specialization.repository.js";

export class CreateSpecializationService {
  constructor(private readonly repo: ISpecializationRepository) {}

  async execute(data: CreateSpecializationDTO): Promise<Specialization> {
    const existingName = await this.repo.findByName(data.name);

    if (existingName) {
      throw new AppError("Specialization already exists", 409);
    }

    const slug = generateSlug(data.name);
    const existingSlug = await this.repo.findBySlug(slug);

    if (existingSlug) {
      throw new AppError("Specialization already exists", 409);
    }

    return this.repo.createSpecialization(data, slug);
  }
}
