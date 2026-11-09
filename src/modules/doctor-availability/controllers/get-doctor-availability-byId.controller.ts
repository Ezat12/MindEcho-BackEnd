import type { Request, Response } from "express";
import type { GetDoctorAvailabilityByIdService } from "../services/get-doctor-availability-byId.service.js";

export class GetDoctorAvailabilityByIdController {
  constructor(
    private readonly getDoctorAvailabilityByIdService: GetDoctorAvailabilityByIdService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response): Promise<void> {
    const { doctorAvailabilityId } = req.params;

    const doctorAvailability =
      await this.getDoctorAvailabilityByIdService.execute(
        String(doctorAvailabilityId),
      );

    res.status(200).json({ status: "success", data: doctorAvailability });
  }
}
