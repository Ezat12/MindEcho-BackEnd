import type { Library } from "../domain/library.js";
import type { PaginationLibraryDTO } from "../dto/pagination-library.dto.js";
import type { ILibrary } from "../repository/library.repository.js";

export class GetAllLibraryService {
  constructor(private readonly libraryRepository: ILibrary) {}

  async execute(
    query: PaginationLibraryDTO,
  ): Promise<{ libraries: Library[]; total: number; totalPages: number }> {
    const { libraries, total } =
      await this.libraryRepository.getAllLibrary(query);

    const totalPages = Math.ceil(total / query.limit);

    return { libraries, total, totalPages };
  }
}
