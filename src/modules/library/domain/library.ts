export interface Library {
  title: string;
  description: string;
  imageUrl: string;
  content?: string | null;
  url?: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
