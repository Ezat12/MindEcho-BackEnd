import { AppError } from "shared/errors/app-error.js";
import type { ICategoryLibraryRepository } from "../repository/category-library.repository.js";

export class DeleteCategoryLibraryService {
  constructor(private readonly repo: ICategoryLibraryRepository) {}

  async execute(id: string) {
    const exist = await this.repo.getCategoryLibraryById(id);

    if (!exist) {
      throw new AppError("Category Library not found", 404);
    }

    await this.repo.deleteCategoryLibrary(id);
  }
}
