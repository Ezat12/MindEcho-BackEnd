import type { Request, Response } from "express";
import type { CreateJournalService } from "../services/create-journal.service.js";

export class CreateJournalController {
  constructor(private readonly createJournalService: CreateJournalService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = req.body;

    const userId = req.user.id;

    const journal = await this.createJournalService.execute(data, userId);

    res.status(201).json({ status: "success", data: journal });
  }
}
