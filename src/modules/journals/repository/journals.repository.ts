import type { Journal } from "../domain/journals.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";

export interface JournalsRepository {
  createJournal(data: CreateJournalDTO, userId: string): Promise<Journal>;
  getJournalById(id: string): Promise<Journal | null>;
  getAllJournals(): Promise<Journal[]>;
  getUserJournals(userId: string): Promise<Journal[]>;
  updateJournal(id: string, data: UpdateJournalDTO): Promise<Journal>;
  deleteJournal(id: string): Promise<void>;
}
