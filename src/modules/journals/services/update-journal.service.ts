import { AppError } from "shared/errors/app-error.js";
import type { Journal } from "../domain/journals.js";
import type { UpdateJournalDTO } from "../dto/update-journal.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";
import type { UploadRepository } from "shared/uploads/upload.repository.js";
import type { CreateAttachment } from "../dto/create-attachments-journal.js";
import { getAttachmentType } from "utils/get-attachment-type.js";
import { prisma } from "config/prisma.js";
import type { Attachments } from "../domain/attachments.js";

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
  ): Promise<{ journal: Journal; attachments?: Attachments[] }> {
    const existJournal = await this.repository.getJournalById(id);

    if (!existJournal || existJournal.userId !== userId) {
      throw new AppError("Journal not found", 404);
    }

    let attachments: CreateAttachment[] = [];

    if (files && files.length > 0) {
      const uploadedFiles =
        await this.uploadRepository.uploadAttachments(files);

      attachments = uploadedFiles.map((file, index) => ({
        url: file.url,
        publicId: file.publicId,
        attachmentType: getAttachmentType(files[index]!.mimetype),
      }));
    }

    let updatedJournal: Journal;
    let createdAttachments: Attachments[] = [];

    try {
      await prisma.$transaction(async (tx) => {
        updatedJournal = await this.repository.updateJournal(tx, id, data);

        if (attachments.length > 0) {
          createdAttachments = await this.repository.createAttachments(
            tx,
            updatedJournal.id,
            attachments,
          );
        }
      });
    } catch (e) {
      await Promise.all(
        attachments.map((attachment) =>
          this.uploadRepository.deleteAttachment(
            attachment.attachmentType,
            attachment.publicId,
          ),
        ),
      );

      throw e;
    }

    return { journal: updatedJournal!, attachments: createdAttachments };
  }
}
