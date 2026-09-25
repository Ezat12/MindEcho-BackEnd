import type { CategoryLibrary } from "../domain/categoryLibrary.js";
import type { ICategoryLibraryRepository } from "../repository/category-library.repository.js";

export class GetAllCategoryLibraryService {
  constructor(private readonly repo: ICategoryLibraryRepository) {}

  async execute(): Promise<CategoryLibrary[]> {
    return await this.repo.getAllCategoryLibrary();
  }
}
