import type { ILibrary } from "../repository/library.repository.js";

export class DeleteLibraryService {
  constructor(private readonly libraryRepository: ILibrary) {}

  async execute(id: string): Promise<void> {
    const library = await this.libraryRepository.getLibraryById(id);

    if (!library) {
      throw new Error("Library not found");
    }

    await this.libraryRepository.deleteLibrary(id);

    
  }
}
