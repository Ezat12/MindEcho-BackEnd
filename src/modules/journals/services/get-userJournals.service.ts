import type { Journal } from "../domain/journals.js";
import type { GetJournalsQueryDTO } from "../dto/pagination.journals.dto.js";
import type { JournalsRepository } from "../repository/journals.repository.js";

export class GetUserJournalsService {
  constructor(private readonly repository: JournalsRepository) {}

  async execute(
    userId: string,
    queryParams: GetJournalsQueryDTO,
  ): Promise<{ journals: Journal[]; total: number; totalPages: number }> {
    const { journals, total } = await this.repository.getUserJournals(
      userId,
      queryParams,
    );

    const totalPages = Math.ceil(total / queryParams.limit);

    return { journals, total, totalPages };
  }
}
