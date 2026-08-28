import type { Request, Response } from "express";
import type { UpdateJournalService } from "../services/update-journal.service.js";

export class UpdateJournalController {
  constructor(private readonly updateJournalService: UpdateJournalService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.user.id;
    const data = res.locals.body;
    const files = req.files as Express.Multer.File[];

    const journal = await this.updateJournalService.execute(
      userId,
      String(id),
      files,
      data,
    );

    res.status(200).json({
      status: "success",
      data: { ...journal.journal, attachments: journal.attachments },
    });
  }
}
