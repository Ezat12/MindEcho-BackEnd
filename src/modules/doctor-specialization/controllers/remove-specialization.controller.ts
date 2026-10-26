import type { Request, Response } from "express";
import type { RemoveSpecializationService } from "../services/remove-specialization.service.js";

export class RemoveSpecializationController {
  constructor(
    private readonly removeSpecializationService: RemoveSpecializationService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await this.removeSpecializationService.execute(String(id));

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  }
}
