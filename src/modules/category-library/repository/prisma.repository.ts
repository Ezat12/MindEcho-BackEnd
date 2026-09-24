import { prisma } from "config/prisma.js";
import type { CategoryLibrary } from "../domain/categoryLibrary.js";
import type { CreateCategoryDTO } from "../dto/create-category.dto.js";
import type { categoryLibraryRepository } from "./category-library.repository.js";
import type { UpdateCategoryDTO } from "../dto/update-category.dto.js";

class PrismaCategoryLibraryRepository implements categoryLibraryRepository {
  async createCategoryLibrary(
    data: CreateCategoryDTO,
    slug: string,
  ): Promise<CategoryLibrary> {
    const category = await prisma.categoryLibrary.create({
      data: {
        ...data,
        slug,
      },
    });

    return category;
  }

  async updateCategoryLibrary(
    id: string,
    data: UpdateCategoryDTO,
    slug?: string,
  ): Promise<CategoryLibrary> {
    const category = await prisma.categoryLibrary.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(slug !== undefined && { slug }),
      },
    });

    return category;
  }

  async getAllCategoryLibrary(): Promise<CategoryLibrary[]> {
    const categories = await prisma.categoryLibrary.findMany();

    return categories;
  }

  async getCategoryLibraryById(id: string): Promise<CategoryLibrary | null> {
    const category = await prisma.categoryLibrary.findUnique({ where: { id } });

    return category;
  }

  async deleteCategoryLibrary(id: string): Promise<void> {
    await prisma.categoryLibrary.delete({ where: { id } });
  }
}
