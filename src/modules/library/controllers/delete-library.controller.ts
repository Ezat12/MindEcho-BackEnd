import type { Request, Response } from "express";
import type { DeleteLibraryService } from "../services/delete-library.service.js";

export class DeleteLibraryController {
  constructor(private readonly deleteLibraryService: DeleteLibraryService) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await this.deleteLibraryService.execute(String(id));

    res
      .status(200)
      .json({ status: "success", message: "Library deleted successfully" });
  }
}
