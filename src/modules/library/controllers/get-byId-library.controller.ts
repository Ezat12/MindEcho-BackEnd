import type { Request, Response } from "express";
import type { GetByIdLibraryService } from "../services/get-byId-library.service.js";

export class GetByIdLibraryController {
  constructor(private readonly getByIdLibraryService: GetByIdLibraryService) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const library = await this.getByIdLibraryService.execute(String(id));

    res.status(200).json({ status: "success", data: library });
  }
}
