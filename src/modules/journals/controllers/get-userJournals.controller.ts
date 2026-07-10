import type { Request, Response } from "express";
import type { GetUserJournalsService } from "../services/get-userJournals.service.js";

export class GetUserJournalsController {
  constructor(private readonly getUserJournalsService: GetUserJournalsService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const userId = req.user.id;

    const journals = await this.getUserJournalsService.execute(userId);

    res.status(200).json({ status: "success", data: journals });
  }
}
