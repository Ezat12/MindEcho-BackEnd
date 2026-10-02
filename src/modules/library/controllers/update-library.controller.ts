import type { Request, Response } from "express";
import type { UpdateLibraryService } from "../services/update-library.service.js";

export class UpdateLibraryController {
  constructor(private readonly updateLibraryService: UpdateLibraryService) {}

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const data = res.locals.body;

    const files = req.files as {
      image: Express.Multer.File[] | undefined;
      resource?: Express.Multer.File[] | undefined;
    };

    const image = files.image?.[0];
    const resource = files.resource?.[0];

    const updatedLibrary = await this.updateLibraryService.execute(
      String(id),
      data,
      image,
      resource,
    );

    res.status(200).json({ status: "success", data: updatedLibrary });
  }
}
