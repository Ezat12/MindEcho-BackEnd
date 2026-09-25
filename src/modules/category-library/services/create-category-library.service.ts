import { generateSlug } from "utils/generate-slug.js";
import type { CreateCategoryDTO } from "../dto/create-category.dto.js";
import type { ICategoryLibraryRepository } from "../repository/category-library.repository.js";
import type { CategoryLibrary } from "../domain/categoryLibrary.js";

export class CreateCategoryLibraryService {
  constructor(private readonly repo: ICategoryLibraryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<CategoryLibrary> {
    const slug = generateSlug(data.name);

    const category = await this.repo.createCategoryLibrary(data, slug);

    return category;
  }
}
