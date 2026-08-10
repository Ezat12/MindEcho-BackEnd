import { AppError } from "shared/errors/app-error.js";
import type { JournalsRepository } from "../repository/journals.repository.js";
import type { UploadRepository } from "shared/uploads/upload.repository.js";

export class DeleteAttachmentService {
  constructor(
    private readonly repository: JournalsRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(userId: string, journalId: string, attachmentId: string): Promise<void> {
    const journal = await this.repository.getJournalById(journalId);

    if (!journal) {
      throw new AppError("Journal not found", 404);
    }

    if (journal.userId !== userId) {
      throw new AppError(
        "You are not authorized to delete this attachment",
        403,
      );
    }
    const attachment = journal.attachments?.find(
      (att) => att.id === attachmentId,
    );

    if (!attachment) {
      throw new AppError("Attachment not found", 404);
    }

    await this.uploadRepository.deleteAttachment(
      attachment.attachmentType,
      attachment.publicId,
    );

    await this.repository.deleteAttachment(attachmentId);
  }
}
