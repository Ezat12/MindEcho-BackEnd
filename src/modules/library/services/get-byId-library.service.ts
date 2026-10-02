import type { Library } from "../domain/library.js";
import type { ILibrary } from "../repository/library.repository.js";

export class GetByIdLibraryService {
  constructor(private readonly libraryRepository: ILibrary) {}

  async execute(id: string): Promise<Library> {
    const library = await this.libraryRepository.getLibraryById(id);

    if (!library) {
      throw new Error("Library not found");
    }

    return library;
  }
}
