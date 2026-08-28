import type { Request, Response } from "express";
import type { CreateJournalService } from "../services/create-journal.service.js";

export class CreateJournalController {
  constructor(private readonly createJournalService: CreateJournalService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const files = req.files as Express.Multer.File[];

    const userId = req.user.id;

    const { journal, attachments } = await this.createJournalService.execute(
      data,
      files,
      userId,
    );

    res
      .status(201)
      .json({ status: "success", data: { ...journal, attachments } });
  }
}
