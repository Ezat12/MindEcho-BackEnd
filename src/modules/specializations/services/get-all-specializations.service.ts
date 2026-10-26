import type { Specialization } from "../domain/specialization.js";
import type { ISpecializationRepository } from "../repository/specialization.repository.js";

export class GetAllSpecializationsService {
  constructor(private readonly repo: ISpecializationRepository) {}

  async execute(): Promise<Specialization[]> {
    return this.repo.getAllSpecializations();
  }
}
