import { prisma } from "config/prisma.js";
import { AppError } from "shared/errors/app-error.js";
import type { UploadRepository } from "shared/uploads/upload.repository.js";
import type { MoodRepository } from "modules/mood/repository/mood-repository.js";

import type { UpdateLibraryDTO } from "../dto/update-library.dto.js";
import type { ILibrary } from "../repository/library.repository.js";
import type { ICategoryLibraryRepository } from "modules/category-library/repository/category-library.repository.js";

export class UpdateLibraryService {
  constructor(
    private readonly repoLibrary: ILibrary,
    private readonly repoMoods: MoodRepository,
    private readonly repoCL: ICategoryLibraryRepository,
    private readonly repoUpload: UploadRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateLibraryDTO,
    image?: Express.Multer.File,
    resource?: Express.Multer.File,
  ) {
    // 1. Check library exists
    const existingLibrary = await this.repoLibrary.getLibraryById(id);

    if (!existingLibrary) {
      throw new AppError("Library not found", 404);
    }

    await this.validateCategoryExists(data.categoryId);



    // 3. If moodIds are part of update
    await this.validateMoodsExist(data.moodIds);

    // 4. Upload new image if provided
    const { imageUrl, imagePublicId } = await this.uploadImage(image);

    // 5. Upload new resource if provided
    const { resourceUrl, resourcePublicId } =
      await this.uploadResource(resource);

    try {
      const updatedLibrary = await prisma.$transaction(async (tx) => {
        const library = await this.repoLibrary.updateLibrary(
          tx,
          id,
          data,
          imageUrl,
          imagePublicId,
          resourceUrl,
          resourcePublicId,
        );

        if (data.moodIds) {
          await tx.libraryMood.deleteMany({
            where: {
              libraryId: id,
            },
          });

          await this.repoLibrary.createLibraryMood(tx, data.moodIds, id);
        }

        return library;
      });

      // 6. Delete old Cloudinary files AFTER DB update succeeds
      if (image) {
        await this.repoUpload.deleteAttachment(
          "IMAGE",
          existingLibrary.imagePublicId,
        );
      }

      if (resource && existingLibrary.urlPublicId) {
        await this.repoUpload.deleteAttachment(
          "VIDEO",
          existingLibrary.urlPublicId,
        );
      }

      return updatedLibrary;
    } catch (error) {
      if (imagePublicId) {
        await this.repoUpload.deleteAttachment("IMAGE", imagePublicId);
      }

      if (resourcePublicId) {
        await this.repoUpload.deleteAttachment("VIDEO", resourcePublicId);
      }

      throw error;
    }
  }

  private async validateCategoryExists(categoryId: string | undefined) {
    if (categoryId) {
      const categoryExists =
        await this.repoCL.getCategoryLibraryById(categoryId);

      if (!categoryExists) {
        throw new AppError("Category not found", 404);
      }
    }
  }

  private async validateMoodsExist(moodIds: string[] | undefined) {
    if (moodIds) {
      const moods = await this.repoMoods.findMany(moodIds);

      if (moods.length !== moodIds.length) {
        throw new AppError("Some mood IDs not found", 404);
      }
    }
  }

  private async uploadImage(
    image: Express.Multer.File | undefined,
  ): Promise<{ imageUrl: string | null; imagePublicId: string | null }> {
    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (image) {
      const [uploadedImage] = await this.repoUpload.uploadAttachments([image]);

      imageUrl = uploadedImage!.url;
      imagePublicId = uploadedImage!.publicId;
    }
    return { imageUrl, imagePublicId };
  }

  private async uploadResource(
    resource: Express.Multer.File | undefined,
  ): Promise<{ resourceUrl: string | null; resourcePublicId: string | null }> {
    let resourceUrl: string | null = null;
    let resourcePublicId: string | null = null;

    if (resource) {
      const [uploadedResource] = await this.repoUpload.uploadAttachments([
        resource,
      ]);

      resourceUrl = uploadedResource!.url;
      resourcePublicId = uploadedResource!.publicId;
    }
    return { resourceUrl, resourcePublicId };
  }
}
