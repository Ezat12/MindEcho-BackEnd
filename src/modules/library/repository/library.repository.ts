import type { Prisma } from ".prisma/client/index.js";
import type { Library } from "../domain/library.js";
import type { CreateLibraryDTO } from "../dto/created-library.dto.js";
import type { UpdateLibraryDTO } from "../dto/update-library.dto.js";
import type { LibraryMood } from "../domain/library-mood.js";

export interface ILibrary {
  createLibrary(
    tx: Prisma.TransactionClient,
    data: CreateLibraryDTO,
  ): Promise<Library>;
  updateLibrary(
    tx: Prisma.TransactionClient,
    id: string,
    data: UpdateLibraryDTO,
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
