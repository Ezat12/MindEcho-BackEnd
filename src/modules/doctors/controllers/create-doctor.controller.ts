import type { Request, Response } from "express";
import type { CreateDoctorService } from "../services/create-doctor.service.js";

export class CreateDoctorController {
  constructor(private readonly createDoctorService: CreateDoctorService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const doctor = await this.createDoctorService.execute(data);

    res.status(201).json({ status: "success", data: doctor });
  }
}
