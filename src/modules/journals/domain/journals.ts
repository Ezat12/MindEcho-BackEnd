export interface Journal {
  id: string;
  title: string;
  content: string;
  userId: string;
  moodId?: string | null;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}
