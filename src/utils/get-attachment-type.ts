import type { AttachmentType } from ".prisma/client/index.js";
import { AppError } from "shared/errors/app-error.js";

export function getAttachmentType(mimetype: string): AttachmentType {
  if (mimetype.startsWith("image/")) {
    return "IMAGE";
  }

  if (mimetype.startsWith("video/")) {
    return "VIDEO";
  }

  if (mimetype.startsWith("audio/")) {
    return "AUDIO";
  }

  throw new AppError("Unsupported attachment type", 400);
}
