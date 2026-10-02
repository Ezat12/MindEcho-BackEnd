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
    imageUrl: string,
    imagePublicId: string,
    url: string | null,
    urlPublicId: string | null,
  ): Promise<Library> {
    const library = await tx.library.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl,
        imagePublicId,
        content: data.content ?? null,
        url,
        urlPublicId,
        categoryId: data.categoryId,
      },
    });

    return library;
  }

  async updateLibrary(
    tx: Prisma.TransactionClient,
    id: string,
    data: UpdateLibraryDTO,
    imageUrl: string | null,
    imagePublicId: string | null,
    resourceUrl: string | null,
    resourcePublicId: string | null,
  ): Promise<Library> {
    const library = await tx.library.update({
      where: { id },
      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.categoryId !== undefined && {
          categoryId: data.categoryId,
        }),

        ...(data.content !== undefined && {
          content: data.content,
        }),

        ...(imageUrl !== null && {
          imageUrl,
        }),

        ...(imagePublicId !== null && {
          imagePublicId,
        }),

        ...(resourceUrl !== null && {
          url: resourceUrl,
        }),

        ...(resourcePublicId !== null && {
          urlPublicId: resourcePublicId,
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

  async createLibraryMood(
    tx: Prisma.TransactionClient,
    moodIds: string[],
    libraryId: string,
  ): Promise<void> {
    await tx.libraryMood.createMany({
      data: moodIds.map((moodId) => ({
        libraryId,
        moodId,
      })),
    });
  }
}
