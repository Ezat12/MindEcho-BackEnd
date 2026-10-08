import type { Request, Response } from "express";

import type { GetAllLibraryService } from "../services/get-all-library.service.js";
import type { PaginationLibraryDTO } from "../dto/pagination-library.dto.js";

export class GetAllLibraryController {
  constructor(private readonly getAllLibraryService: GetAllLibraryService) {}

  async handle(req: Request, res: Response) {
    const queryParams = res.locals.query as PaginationLibraryDTO;

    const { libraries, total, totalPages } =
      await this.getAllLibraryService.execute(queryParams);

    res.status(200).json({
      status: "success",
      data: libraries,
      meta: {
        page: queryParams.page,
        limit: queryParams.limit,
        total,
        totalPages,
      },
    });
  }
}
