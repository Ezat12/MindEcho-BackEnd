import { AppError } from "shared/errors/app-error.js";
import type { ISpecializationRepository } from "../repository/specialization.repository.js";

export class DeleteSpecializationService {
  constructor(private readonly repo: ISpecializationRepository) {}

  async execute(id: string): Promise<void> {
    const exist = await this.repo.getSpecializationById(id);

    if (!exist) {
      throw new AppError("Specialization not found", 404);
    }

    await this.repo.deleteSpecialization(id);
  }
}
