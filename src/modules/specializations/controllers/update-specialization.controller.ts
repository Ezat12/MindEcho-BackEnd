import type { Request, Response } from "express";
import type { UpdateSpecializationService } from "../services/update-specialization.service.js";

export class UpdateSpecializationController {
  constructor(
    private readonly updateSpecializationService: UpdateSpecializationService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;
    const { id } = req.params;

    const specialization = await this.updateSpecializationService.execute(
      String(id),
      data,
    );

    res.status(200).json({
      status: "success",
      message: "Updated Successfully",
      data: specialization,
    });
  }
}
