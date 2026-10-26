import type { Request, Response } from "express";
import type { CreateSpecializationService } from "../services/create-specialization.service.js";

export class CreateSpecializationController {
  constructor(
    private readonly createSpecializationService: CreateSpecializationService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const specialization =
      await this.createSpecializationService.execute(data);

    res.status(201).json({ status: "success", data: specialization });
  }
}
