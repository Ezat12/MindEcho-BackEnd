import type { AttachmentType } from ".prisma/client/index.js";

export interface UploadRepository {
  uploadAttachments(
    files: Express.Multer.File[],
  ): Promise<{ url: string; publicId: string }[]>;

  deleteAttachment(resourceType: AttachmentType, publicId: string): Promise<void>;
}
