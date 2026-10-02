import type { Prisma } from ".prisma/client/index.js";
import type { Library } from "../domain/library.js";
import type { CreateLibraryDTO } from "../dto/created-library.dto.js";
import type { UpdateLibraryDTO } from "../dto/update-library.dto.js";
import type { LibraryMood } from "../domain/library-mood.js";

export interface ILibrary {
  createLibrary(
    tx: Prisma.TransactionClient,
    data: CreateLibraryDTO,
    imageUrl: string ,
    imagePublicId: string,
    resourceUrl: string | null,
    resourcePublicId: string | null,
  ): Promise<Library>;
  updateLibrary(
    tx: Prisma.TransactionClient,
    id: string,
    data: UpdateLibraryDTO,
    imageUrl: string | null,
    imagePublicId: string | null,
    resourceUrl: string | null,
    resourcePublicId: string | null,
  ): Promise<Library>;
  getAllLibrary(): Promise<Library[]>;
  getLibraryById(id: string): Promise<Library | null>;
  deleteLibrary(id: string): Promise<void>;

  // Library Mood
  createLibraryMood(
    tx: Prisma.TransactionClient,
    moodIds: string[],
    libraryId: string,
  ): Promise<void>;
}
