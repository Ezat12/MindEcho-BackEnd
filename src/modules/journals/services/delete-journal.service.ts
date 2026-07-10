import { AppError } from "shared/errors/app-error.js";
import type { JournalsRepository } from "../repository/journals.repository.js";
import type { Role } from "@prisma/client";

export class DeleteJournalService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(id: string, userId: string, role: Role) {
    const existJournal = await this.repository.getJournalById(id);

    console.log("Exist journal:", existJournal);

    if (!existJournal) {
      throw new AppError("Journal not found", 404);
    }

    if (role === "ADMIN") {
      await this.repository.deleteJournal(id);
      return true;
    }

    if (existJournal.userId !== userId) {
      throw new AppError("Journal not found", 404);
    }

    await this.repository.deleteJournal(id);

    return true;
  }
}
