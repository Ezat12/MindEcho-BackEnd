import type { Request, Response } from "express";

import type { UpdateDoctorAvailabilityService } from "../services/update-doctor-availability.service.js";

export class UpdateDoctorAvailabilityController {
  constructor(
    private readonly updateDoctorAvailabilityService: UpdateDoctorAvailabilityService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response): Promise<void> {
    const data = res.locals.body;
    const { doctorAvailabilityId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const updatedAvailability =
      await this.updateDoctorAvailabilityService.execute(
        String(doctorAvailabilityId),
        data,
        userId,
        role,
      );

    res.status(200).json({
      status: "success",
      message: "Doctor availability updated successfully",
      data: updatedAvailability,
    });
  }
}
