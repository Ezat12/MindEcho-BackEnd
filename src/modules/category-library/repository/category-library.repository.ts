import type { CategoryLibrary } from "../domain/categoryLibrary.js";
import type { CreateCategoryDTO } from "../dto/create-category.dto.js";
import type { UpdateCategoryDTO } from "../dto/update-category.dto.js";

export interface categoryLibraryRepository {
  createCategoryLibrary(
    data: CreateCategoryDTO,
    slug: string,
  ): Promise<CategoryLibrary>;
  updateCategoryLibrary(
    id: string,
    data: UpdateCategoryDTO,
    slug: string,
  ): Promise<CategoryLibrary>;
  getAllCategoryLibrary(): Promise<CategoryLibrary[]>;
  getCategoryLibraryById(id: string): Promise<CategoryLibrary | null>;
  deleteCategoryLibrary(id: string): Promise<void>;
}
