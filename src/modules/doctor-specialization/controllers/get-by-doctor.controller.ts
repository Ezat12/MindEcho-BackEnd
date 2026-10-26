import type { Request, Response } from "express";
import type { GetSpecializationsByDoctorService } from "../services/get-by-doctor.service.js";

export class GetSpecializationsByDoctorController {
  constructor(
    private readonly getSpecializationsByDoctorService: GetSpecializationsByDoctorService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { doctorId } = req.params;

    const relations = await this.getSpecializationsByDoctorService.execute(
      String(doctorId),
    );

    res.status(200).json({
      status: "success",
      data: relations,
    });
  }
}
