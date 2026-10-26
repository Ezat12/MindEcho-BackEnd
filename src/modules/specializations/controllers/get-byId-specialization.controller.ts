import type { Request, Response } from "express";
import type { GetSpecializationByIdService } from "../services/get-byId-specialization.service.js";

export class GetSpecializationByIdController {
  constructor(
    private readonly getSpecializationByIdService: GetSpecializationByIdService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const specialization = await this.getSpecializationByIdService.execute(
      String(id),
    );

    res.status(200).json({
      status: "success",
      data: specialization,
    });
  }
}
