import type { Request, Response } from "express";
import type { GetAllSpecializationsService } from "../services/get-all-specializations.service.js";

export class GetAllSpecializationsController {
  constructor(
    private readonly getAllSpecializationsService: GetAllSpecializationsService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const specializations = await this.getAllSpecializationsService.execute();

    res.status(200).json({
      status: "success",
      data: specializations,
    });
  }
}
