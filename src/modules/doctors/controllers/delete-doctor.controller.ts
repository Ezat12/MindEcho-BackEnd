import type { Request, Response } from "express";
import type { DeleteDoctorService } from "../services/delete-doctor.service.js";

export class DeleteDoctorController {
  constructor(private readonly deleteDoctorService: DeleteDoctorService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const { id } = req.params;

    await this.deleteDoctorService.execute(String(id));

    res.status(200).json({
      status: "success",
      message: "Deleted Successfully",
    });
  }
}
