import { AppError } from "shared/errors/app-error.js";
import type { CategoryLibrary } from "../domain/categoryLibrary.js";
import type { ICategoryLibraryRepository } from "../repository/category-library.repository.js";
import { generateSlug } from "utils/generate-slug.js";
import type { UpdateCategoryDTO } from "../dto/update-category.dto.js";

export class updateCategoryLibraryService {
  constructor(private readonly repo: ICategoryLibraryRepository) {}

  async execute(id: string, data: UpdateCategoryDTO): Promise<CategoryLibrary> {
    const exist = await this.repo.getCategoryLibraryById(id);

    if (!exist) {
      throw new AppError("Category Library not found", 404);
    }

    const slug = generateSlug(data.name);

    return await this.repo.updateCategoryLibrary(id, data, slug);
  }
}
