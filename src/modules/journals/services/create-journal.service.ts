import type { UploadRepository } from "shared/uploads/upload.repository.js";
import type { Journal } from "../domain/journals.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";
import { getAttachmentType } from "utils/get-attachment-type.js";
import type { CreateAttachment } from "../dto/create-attachments-journal.js";
import type { Attachments } from "../domain/attachments.js";
import { prisma } from "config/prisma.js";

export class CreateJournalService {
  constructor(
    private readonly repository: JournalsRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(
    data: CreateJournalDTO,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<{ journal: Journal; attachments: Attachments[] }> {
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

    try {
      return await prisma.$transaction(async (tx) => {
        const journal = await this.repository.createJournal(tx, data, userId);

        const createdAttachments = await this.repository.createAttachments(
          tx,
          journal.id,
          attachments,
        );

        return { journal, attachments: createdAttachments };
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
  }
}
