import type { Request, Response } from "express";

import type { CreateDoctorAvailabilityService } from "../services/create-doctor-availability.service.js";

export class CreateDoctorAvailabilityController {
  constructor(
    private readonly createDoctorAvailabilityService: CreateDoctorAvailabilityService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response): Promise<void> {
    const data = res.locals.body;

    const userId = req.user.id;
    const role = req.user.role;

    const createdAvailability =
      await this.createDoctorAvailabilityService.execute(data, userId, role);

    res.status(201).json({ status: "success", data: createdAvailability });
  }
}
