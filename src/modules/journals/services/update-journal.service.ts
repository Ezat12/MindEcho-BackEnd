import { AppError } from "shared/errors/app-error.js";
import type { Journal } from "../domain/journals.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";

export class UpdateJournalService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(
    userId: string,
    id: string,
    data: UpdateJournalDTO,
  ): Promise<Journal> {
    const existJournal = await this.repository.getJournalById(id);

    if (!existJournal || existJournal.userId !== userId) {
      throw new AppError("Journal not found", 404);
    }

    const journal = await this.repository.updateJournal(id, data);

    return journal;
  }
}
