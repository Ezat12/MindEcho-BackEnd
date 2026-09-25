import { AppError } from "shared/errors/app-error.js";
import type { ICategoryLibraryRepository } from "../repository/category-library.repository.js";
import type { CategoryLibrary } from "../domain/categoryLibrary.js";

export class getCategoryLibraryByIdService {
  constructor(private readonly repo: ICategoryLibraryRepository) {}

  async execute(id: string): Promise<CategoryLibrary> {
    const category = await this.repo.getCategoryLibraryById(id);

    if (!category) {
      throw new AppError("Category Library not found", 404);
    }

    return category;
  }
}
