import type { Request, Response } from "express";

import type { CreateDoctorAvailabilityService } from "../services/create-doctor-availability.service.js";

export class CreateDoctorAvailabilityController {
  constructor(
    private readonly createDoctorAvailabilityService: CreateDoctorAvailabilityService,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const data = res.locals.body;

    const userId = res.locals.userId;
    const role = res.locals.role;

    const createdAvailability =
      await this.createDoctorAvailabilityService.execute(data, userId, role);

    res.status(201).json({ status: "success", data: createdAvailability });
  }
}
