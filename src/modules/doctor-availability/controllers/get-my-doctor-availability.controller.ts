import type { Request, Response } from "express";
import type { GetMyDoctorAvailabilityService } from "../services/get-my-doctor-availability.service.js";

export class GetMyDoctorAvailabilityController {
  constructor(
    private readonly getMyDoctorAvailabilityService: GetMyDoctorAvailabilityService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user.id;

    const doctorAvailability =
      await this.getMyDoctorAvailabilityService.execute(String(userId));

    res.status(200).json({ status: "success", data: doctorAvailability });
  }
}
