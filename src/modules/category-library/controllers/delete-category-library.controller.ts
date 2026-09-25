import type { Response, Request } from "express";
import type { DeleteCategoryLibraryService } from "../services/delete-category-library.service.js";

export class deleteCategoryLibraryController {
  constructor(
    private readonly deleteCategoryLibraryService: DeleteCategoryLibraryService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await this.deleteCategoryLibraryService.execute(String(id));

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  }
}
