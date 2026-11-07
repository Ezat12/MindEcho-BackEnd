import type { Request, Response } from "express";

import type { UpdateDoctorAvailabilityService } from "../services/update-doctor-availability.service.js";

export class UpdateDoctorAvailabilityController {
  constructor(
    private readonly updateDoctorAvailabilityService: UpdateDoctorAvailabilityService,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const data = res.locals.body;
    const id = req.params.id;
    const userId = res.locals.userId;
    const role = res.locals.role;

    const updatedAvailability =
      await this.updateDoctorAvailabilityService.execute(
        String(id),
        data,
        userId,
        role,
      );

    res.status(200).json({ status: "success", data: updatedAvailability });
  }
}
