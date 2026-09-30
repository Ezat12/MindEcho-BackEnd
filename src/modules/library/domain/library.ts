export interface Library {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  content?: string | null;
  url?: string | null;
  urlPublicId?: string | null;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
