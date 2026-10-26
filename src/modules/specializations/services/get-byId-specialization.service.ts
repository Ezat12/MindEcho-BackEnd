import { AppError } from "shared/errors/app-error.js";
import type { Specialization } from "../domain/specialization.js";
import type { ISpecializationRepository } from "../repository/specialization.repository.js";

export class GetSpecializationByIdService {
  constructor(private readonly repo: ISpecializationRepository) {}

  async execute(id: string): Promise<Specialization> {
    const specialization = await this.repo.getSpecializationById(id);

    if (!specialization) {
      throw new AppError("Specialization not found", 404);
    }

    return specialization;
  }
}
