import type { Journal } from "../domain/journals.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";
import type { CreateAttachment } from "../dto/create-attachments-journal.js";
import type { Attachments } from "../domain/attachments.js";
import type { Prisma } from ".prisma/client/index.js";
import type { GetJournalsQueryDTO } from "../dto/pagination.journals.dto.js";

export interface JournalsRepository {
  createJournal(
    tx: Prisma.TransactionClient,
    data: CreateJournalDTO,
    userId: string,
  ): Promise<Journal>;
  getJournalById(id: string): Promise<Journal | null>;
  getAllJournals(queryParams: GetJournalsQueryDTO): Promise<{
    journals: Journal[];
    total: number;
  }>;
  getUserJournals(
    userId: string,
    queryParams: GetJournalsQueryDTO,
  ): Promise<{ journals: Journal[]; total: number }>;
  updateJournal(
    tx: Prisma.TransactionClient,
    id: string,
    data: UpdateJournalDTO,
  ): Promise<Journal>;
  deleteJournal(id: string): Promise<void>;

  createAttachments(
    tx: Prisma.TransactionClient,
    journalId: string,
    attachments: CreateAttachment[],
  ): Promise<Attachments[]>;

  deleteAttachment(attachmentId: string): Promise<void>;

  getAttachmentsByJournalId(journalId: string): Promise<Attachments[]>;
}
