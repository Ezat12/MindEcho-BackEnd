import type { UploadRepository } from "shared/uploads/upload.repository.js";
import type { Journal } from "../domain/journals.js";
import type { CreateJournalDTO } from "../dto/create-journal.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";
import { getAttachmentType } from "utils/get-attachment-type.js";
import type { CreateAttachment } from "../dto/create-attachments-journal.js";
import type { Attachments } from "../domain/attachments.js";
import { prisma } from "config/prisma.js";
import type { MoodRepository } from "modules/mood/repository/mood-repository.js";
import { AppError } from "shared/errors/app-error.js";

export class CreateJournalService {
  constructor(
    private readonly repository: JournalsRepository,
    private readonly uploadRepository: UploadRepository,
    private readonly moodRepository: MoodRepository,
  ) {}

  async execute(
    data: CreateJournalDTO,
    files: Express.Multer.File[],
    userId: string,
  ): Promise<{ journal: Journal; attachments: Attachments[] }> {
    let attachments: CreateAttachment[] = [];

    await this.validMoodId(data.moodId);

    attachments = await this.uploadAttachments(files);

    try {
      return await prisma.$transaction(async (tx) => {
        const journal = await this.repository.createJournal(tx, data, userId);

        let createdAttachments: Attachments[] = [];
        if (attachments.length > 0) {
          createdAttachments = await this.repository.createAttachments(
            tx,
            journal.id,
            attachments,
          );
        }

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

  private async validMoodId(moodId?: string | null): Promise<void> {
    if (!moodId) return;

    const mood = await this.moodRepository.getMoodById(moodId);

    if (!mood) {
      throw new AppError("Mood not found", 404);
    }
  }

  private async uploadAttachments(
    files: Express.Multer.File[],
  ): Promise<CreateAttachment[]> {
    if (!files || files.length === 0) return [];

    const uploadedFiles = await this.uploadRepository.uploadAttachments(files);

    return uploadedFiles.map((file, index) => ({
      url: file.url,
      publicId: file.publicId,
      attachmentType: getAttachmentType(files[index]!.mimetype),
    }));
  }
}
