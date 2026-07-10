import type { Journal } from "../domain/journals.js";
import type { JournalsRepository } from "../repository/journals.repository.js";

export class GetUserJournalsService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(userId: string): Promise<Journal[]> {
    const journals = await this.repository.getUserJournals(userId);

    return journals;
  }
}
