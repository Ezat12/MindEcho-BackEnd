import type { Request, Response } from "express";
import type { DeleteDoctorAvailabilityService } from "../services/delete-doctor-availability.service.js";

export class DeleteDoctorAvailabilityController {
  constructor(
    private readonly deleteDoctorAvailabilityService: DeleteDoctorAvailabilityService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response): Promise<void> {
    const { doctorAvailabilityId } = req.params;

    await this.deleteDoctorAvailabilityService.execute(
      String(doctorAvailabilityId),
      req.user.id,
      req.user.role,
    );

    res
      .status(204)
      .json({
        status: "success",
        message: "Doctor availability deleted successfully",
      });
  }
}
