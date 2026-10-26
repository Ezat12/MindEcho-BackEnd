import type { Request, Response } from "express";
import type { DeleteSpecializationService } from "../services/delete-specialization.service.js";

export class DeleteSpecializationController {
  constructor(
    private readonly deleteSpecializationService: DeleteSpecializationService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await this.deleteSpecializationService.execute(String(id));

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  }
}
