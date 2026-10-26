import type { Request, Response } from "express";
import type { GetDoctorByIdService } from "../services/get-byId-doctor.service.js";

export class GetDoctorByIdController {
  constructor(private readonly getDoctorByIdService: GetDoctorByIdService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const doctor = await this.getDoctorByIdService.execute(String(id));

    res.status(200).json({
      status: "success",
      data: doctor,
    });
  }
}
