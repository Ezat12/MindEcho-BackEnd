import type { Request, Response } from "express";
import type { GetDoctorAvailabilityByIdService } from "../services/get-doctor-availability-byId.service.js";

export class GetDoctorAvailabilityByIdControllers {
  constructor(
    private readonly getDoctorAvailabilityByIdService: GetDoctorAvailabilityByIdService,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { doctorAvailabilityId } = req.params;

    const doctorAvailability =
      await this.getDoctorAvailabilityByIdService.execute(
        String(doctorAvailabilityId),
      );

    res.status(200).json({ status: "success", data: doctorAvailability });
  }
}
