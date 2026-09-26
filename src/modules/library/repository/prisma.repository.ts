import { prisma } from "config/prisma.js";
import type { Prisma } from ".prisma/client/index.js";

import type { Library } from "../domain/library.js";
import type { CreateLibraryDTO } from "../dto/created-library.dto.js";
import type { UpdateLibraryDTO } from "../dto/update-library.dto.js";
import type { ILibrary } from "./library.repository.js";

export class PrismaLibraryRepository implements ILibrary {
  async createLibrary(
    tx: Prisma.TransactionClient,
    data: CreateLibraryDTO,
  ): Promise<Library> {
    const library = await tx.library.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        content: data.content ?? null,
        url: data.url ?? null,
        categoryId: data.categoryId,
      },
    });

    return library;
  }

  async updateLibrary(
    tx: Prisma.TransactionClient,
    id: string,
    data: UpdateLibraryDTO,
  ): Promise<Library> {
    const library = await tx.library.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.imageUrl !== undefined && {
          imageUrl: data.imageUrl,
        }),
        ...(data.content !== undefined && {
          content: data.content,
        }),
        ...(data.url !== undefined && {
          url: data.url,
        }),
        ...(data.categoryId !== undefined && {
          categoryId: data.categoryId,
        }),
      },
    });

    return library;
  }

  async getAllLibrary(): Promise<Library[]> {
    const libraries = await prisma.library.findMany();

    return libraries;
  }

  async getLibraryById(id: string): Promise<Library | null> {
    const library = await prisma.library.findUnique({
      where: { id },
    });


    return library;
  }

  async deleteLibrary(id: string): Promise<void> {
    await prisma.library.delete({
      where: { id },
    });
  }
}
