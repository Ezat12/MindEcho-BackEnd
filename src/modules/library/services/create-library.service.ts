import type { MoodRepository } from "modules/mood/repository/mood-repository.js";
import type { CreateLibraryDTO } from "../dto/created-library.dto.js";
import type { ILibrary } from "../repository/library.repository.js";
import type { UploadRepository } from "shared/uploads/upload.repository.js";
import { AppError } from "shared/errors/app-error.js";
import { prisma } from "config/prisma.js";

export class CreateLibraryService {
  constructor(
    private readonly repoLibrary: ILibrary,
    private readonly repoMoods: MoodRepository,
    private readonly repoUpload: UploadRepository,
  ) {}

  async execute(
    data: CreateLibraryDTO,
    imageUrl: Express.Multer.File,
    resource?: Express.Multer.File,
  ) {
    const moods = await this.repoMoods.findMany(data.moodIds);

    if (moods.length !== data.moodIds.length) {
      throw new AppError("Some mood IDs not found", 404);
    }

    const [uploadedImage] = await this.repoUpload.uploadAttachments([imageUrl]);

    let resourceUrl: string | null = null;
    let resourcePublicId: string | null = null;

    if (resource) {
      const [uploadedResource] = await this.repoUpload.uploadAttachments([
        resource,
      ]);

      resourceUrl = uploadedResource!.url;
      resourcePublicId = uploadedResource!.publicId;
    }
    try {
      return await prisma.$transaction(async (tx) => {
        const library = await this.repoLibrary.createLibrary(
          tx,
          data,
          uploadedImage!.url,
          uploadedImage!.publicId,
          resourceUrl,
          resourcePublicId,
        );

        await this.repoLibrary.createLibraryMood(tx, data.moodIds, library.id);

        return library;
      });
    } catch (error) {
      await this.repoUpload.deleteAttachment("IMAGE", uploadedImage!.publicId);

      if (resourcePublicId) {
        await this.repoUpload.deleteAttachment("VIDEO", resourcePublicId);
      }

      throw error;
    }
  }
}
