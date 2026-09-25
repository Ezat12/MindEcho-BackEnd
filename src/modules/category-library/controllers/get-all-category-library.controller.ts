import type { Request, Response } from "express";
import type { GetAllCategoryLibraryService } from "../services/get-all-category-library.service.js";

export class GetAllCategoryLibraryController {
  constructor(
    private readonly getAllCategoryLibraryService: GetAllCategoryLibraryService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const categories = await this.getAllCategoryLibraryService.execute();

    res.status(200).json({
      status: "success",
      data: categories,
    });
  }
}
