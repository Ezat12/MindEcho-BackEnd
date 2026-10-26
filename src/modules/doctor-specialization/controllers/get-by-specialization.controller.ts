import type { Request, Response } from "express";
import type { GetDoctorsBySpecializationService } from "../services/get-by-specialization.service.js";

export class GetDoctorsBySpecializationController {
  constructor(
    private readonly getDoctorsBySpecializationService: GetDoctorsBySpecializationService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { specializationId } = req.params;

    const relations = await this.getDoctorsBySpecializationService.execute(
      String(specializationId),
    );

    res.status(200).json({
      status: "success",
      data: relations,
    });
  }
}
