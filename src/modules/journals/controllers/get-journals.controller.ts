import type { Request, Response } from "express";
import type { GetAllJournalsService } from "../services/get-journals.service.js";

export class GetJournalsController {
  constructor(private readonly getAllJournalsService: GetAllJournalsService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const journals = await this.getAllJournalsService.execute();

    res.status(200).json({ status: "success", data: journals });
  }
}
