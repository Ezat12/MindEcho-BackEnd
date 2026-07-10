import { AppError } from "shared/errors/app-error.js";
import type { Journal } from "../domain/journals.js";
import type { JournalsRepository } from "../repository/journals.repository.js";

export class GetJournalByIdService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(id: string, userId: string): Promise<Journal> {
    const journal = await this.repository.getJournalById(id);

    if (!journal || journal.userId !== userId) {
      throw new AppError("Journal not found", 404);
    }

    return journal;
  }
}
