import type { Request, Response } from "express";
import { DeleteJournalService } from "../services/delete-journal.service.js";

export class DeleteJournalController {
  constructor(private readonly deleteJournalService: DeleteJournalService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.user.id;
    const role = req.user.role;

    await this.deleteJournalService.execute(String(id), userId, role);

    res
      .status(200)
      .json({ status: "success", message: "Journal deleted successfully" });
  }
}
