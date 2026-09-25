import type { Request, Response } from "express";
import type { getCategoryLibraryByIdService } from "../services/get-byId-category-library.service.js";
import type { CategoryLibrary } from "../domain/categoryLibrary.js";

export class getCategoryLibraryByIdController {
  constructor(private readonly geyCLById: getCategoryLibraryByIdService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const category: CategoryLibrary = await this.geyCLById.execute(String(id));

    res.status(200).json({
      status: "success",
      data: category,
    });
  }
}
