import cloudinary from "config/cloudinary.js";
import type { UploadRepository } from "./upload.repository.js";
import { AppError } from "shared/errors/app-error.js";
import type { AttachmentType } from ".prisma/client/index.js";

export class CloudinaryRepository implements UploadRepository {
  async uploadAttachments(
    files: Express.Multer.File[],
  ): Promise<{ url: string; publicId: string }[]> {
    const uploads = files.map((file) => {
      return new Promise<{
        url: string;
        publicId: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
                return;
              }

              if (!result?.secure_url) {
                reject(new AppError("Upload failed", 500));

                return;
              }

              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            },
          )
          .end(file.buffer);
      });
    });

    return Promise.all(uploads);
  }

  async deleteAttachment(
    resourceType: AttachmentType,
    publicId: string,
  ): Promise<void> {
    const cloudinaryResourceType = resourceType === "IMAGE" ? "image" : "video";

    await cloudinary.uploader.destroy(publicId, {
      resource_type: cloudinaryResourceType,
    });
  }
}
