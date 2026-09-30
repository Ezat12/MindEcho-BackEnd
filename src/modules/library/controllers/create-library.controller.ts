import type { Request, Response } from "express";

import type { CreateLibraryService } from "../services/create-library.service.js";
import { AppError } from "shared/errors/app-error.js";

export class CreateLibraryController {
  constructor(private readonly createLibraryService: CreateLibraryService) {}

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const files = req.files as {
      image: Express.Multer.File[];
      resource?: Express.Multer.File[];
    };

    const image = files.image[0];
    const resource = files.resource?.[0];

    if (!image) {
      throw new AppError("Image is required", 404);
    }

    const library = await this.createLibraryService.execute(
      data,
      image,
      resource,
    );

    res.status(201).json({
      status: "success",
      data: library,
    });
  }
}
