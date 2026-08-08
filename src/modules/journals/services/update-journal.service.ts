import { AppError } from "shared/errors/app-error.js";
import type { Journal } from "../domain/journals.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";
import type { UploadRepository } from "shared/uploads/upload.repository.js";

export class UpdateJournalService {
  constructor(
    private readonly repository: JournalsRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(
    userId: string,
    id: string,
    files: Express.Multer.File[],
    data: UpdateJournalDTO,
  ): Promise<Journal> {
    const existJournal = await this.repository.getJournalById(id);

    if (!existJournal || existJournal.userId !== userId) {
      throw new AppError("Journal not found", 404);
    }

    if (files && files.length > 0) {
      // await this.uploadRepository.deleteUploads(existJournal.uploadIds);
      data.attachments = await this.uploadRepository.uploads(files);
    }

    const journal = await this.repository.updateJournal(id, data);

    return journal;
  }
}
