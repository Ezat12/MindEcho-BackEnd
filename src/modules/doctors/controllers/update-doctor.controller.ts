import type { Request, Response } from "express";
import type { UpdateDoctorService } from "../services/update-doctor.service.js";

export class UpdateDoctorController {
  constructor(private readonly updateDoctorService: UpdateDoctorService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;
    const { id } = req.params;

    const doctor = await this.updateDoctorService.execute(String(id), data);

    res.status(200).json({
      status: "success",
      message: "Updated Successfully",
      data: doctor,
    });
  }
}
