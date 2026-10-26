import type { Request, Response } from "express";
import type { RemoveSpecializationByPairService } from "../services/remove-by-pair.service.js";

export class RemoveSpecializationByPairController {
  constructor(
    private readonly removeSpecializationByPairService: RemoveSpecializationByPairService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { doctorId, specializationId } = req.params;

    await this.removeSpecializationByPairService.execute(
      String(doctorId),
      String(specializationId),
    );

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  }
}
