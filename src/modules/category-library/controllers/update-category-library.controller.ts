import type { Request, Response } from "express";
import type { updateCategoryLibraryService } from "../services/update-category-library.service.js";

export class updateCategoryLibraryController {
  constructor(private readonly updateCLService: updateCategoryLibraryService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const { id } = req.params;

    const category = await this.updateCLService.execute(String(id), data);

    res.status(200).json({
      status: "success",
      message: "Updated Successfully",
      data: category,
    });
  }
}
