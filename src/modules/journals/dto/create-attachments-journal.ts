import { AttachmentType } from ".prisma/client/index.js";
export interface CreateAttachment {
  url: string;
  publicId: string;
  attachmentType: AttachmentType;
}
