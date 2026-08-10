import type { Attachments } from "./attachments.js";

export interface Journal {
  id: string;
  title: string;
  content: string;
  userId: string;
  moodId?: string | null;
  attachments?: Attachments[];
  createdAt: Date;
  updatedAt: Date;
}
