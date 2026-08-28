import type { Request, Response } from "express";
import type { GetAllJournalsService } from "../services/get-journals.service.js";
import type { GetJournalsQueryDTO } from "../dto/pagination.journals.dto.js";

export class GetJournalsController {
  constructor(private readonly getAllJournalsService: GetAllJournalsService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const queryParams = res.locals.query as GetJournalsQueryDTO;

    const { journals, total, totalPages } =
      await this.getAllJournalsService.execute(queryParams);

    res.status(200).json({
      status: "success",
      data: journals,
      meta: {
        page: queryParams.page,
        limit: queryParams.limit,
        total,
        totalPages,
      },
    });
  }
}
