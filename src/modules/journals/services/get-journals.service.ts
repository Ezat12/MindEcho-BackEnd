import type { Journal } from "../domain/journals.js";
import type { JournalsRepository } from "../repository/journals.repository.js";

export class GetAllJournalsService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(): Promise<Journal[]> {
    const journals = await this.repository.getAllJournals();

    return journals;
  }
}
