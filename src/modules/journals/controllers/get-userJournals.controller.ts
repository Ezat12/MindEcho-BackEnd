import type { Request, Response } from "express";
import type { GetUserJournalsService } from "../services/get-userJournals.service.js";
import {
  getJournalsQuerySchema,
  type GetJournalsQueryDTO,
} from "../dto/pagination.journals.dto.js";

export class GetUserJournalsController {
  constructor(private readonly getUserJournalsService: GetUserJournalsService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const queryParams = req.query as GetJournalsQueryDTO;

    const journals = await this.getUserJournalsService.execute(
      userId,
      queryParams,
    );

    res.status(200).json({ status: "success", data: journals });
  }
}
