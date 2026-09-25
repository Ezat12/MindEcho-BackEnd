import type { Request, Response } from "express";
import type { CreateCategoryLibraryService } from "../services/create-category-library.service.js";

export class CreateCategoryLibraryController {
  constructor(
    private readonly createCategoryLibraryService: CreateCategoryLibraryService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const category = await this.createCategoryLibraryService.execute(data);

    res.status(201).json({ status: "success", data: category });
  }
}
