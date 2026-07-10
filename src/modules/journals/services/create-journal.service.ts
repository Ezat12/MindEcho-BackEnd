import type { Journal } from "../domain/journals.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";

export class CreateJournalService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(data: CreateJournalDTO, userId: string): Promise<Journal> {
    const journal = await this.repository.createJournal(data, userId);

    return journal;
  }
}
