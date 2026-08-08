import type { AttachmentType } from ".prisma/client/index.js";


export interface Attachments {
  id: string;
  journalId: string;
  url: string;
  publicId: string;
  attachmentType: AttachmentType;
  createdAt: Date;
}