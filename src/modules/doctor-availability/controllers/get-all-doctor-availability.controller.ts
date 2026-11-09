import type { Request, Response } from "express";

import type { GetAllDoctorAvailabilityService } from "../services/get-all-doctor-availability.service.js";

export class GetAllDoctorAvailabilityController {
  constructor(
    private readonly getAllDoctorAvailabilityService: GetAllDoctorAvailabilityService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response): Promise<void> {
    const doctorId = req.params.doctorId;

    const doctorAvailability =
      await this.getAllDoctorAvailabilityService.execute(String(doctorId));

    res.status(200).json({ status: "success", data: doctorAvailability });
  }
}
