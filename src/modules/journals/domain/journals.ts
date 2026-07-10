export interface Journal {
  id: string;
  title: string;
  content: string;
  userId: string;
  moodId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
