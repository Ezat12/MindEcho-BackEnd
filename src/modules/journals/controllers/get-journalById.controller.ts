import type { Request, Response } from "express";
import type { GetJournalByIdService } from "../services/get-journalById.service.js";

export class GetJournalByIdController {
  constructor(private readonly getJournalByIdService: GetJournalByIdService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    const journal = await this.getJournalByIdService.execute(
      String(id),
      userId,
    );

    res.status(200).json({ status: "success", data: journal });
  }
}
