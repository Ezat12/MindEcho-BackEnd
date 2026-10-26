import { AppError } from "shared/errors/app-error.js";
import { generateSlug } from "utils/generate-slug.js";
import type { Specialization } from "../domain/specialization.js";
import type { UpdateSpecializationDTO } from "../dto/update-specialization.dto.js";
import type { ISpecializationRepository } from "../repository/specialization.repository.js";

export class UpdateSpecializationService {
  constructor(private readonly repo: ISpecializationRepository) {}

  async execute(
    id: string,
    data: UpdateSpecializationDTO,
  ): Promise<Specialization> {
    const exist = await this.repo.getSpecializationById(id);

    if (!exist) {
      throw new AppError("Specialization not found", 404);
    }

    let slug: string | undefined;

    if (data.name !== undefined) {
      const existingName = await this.repo.findByName(data.name);

      if (existingName && existingName.id !== id) {
        throw new AppError("Specialization already exists", 409);
      }

      slug = generateSlug(data.name);
      const existingSlug = await this.repo.findBySlug(slug);

      if (existingSlug && existingSlug.id !== id) {
        throw new AppError("Specialization already exists", 409);
      }
    }

    return this.repo.updateSpecialization(id, data, slug);
  }
}
