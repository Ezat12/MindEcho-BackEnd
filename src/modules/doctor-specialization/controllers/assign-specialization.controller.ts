import type { Request, Response } from "express";
import type { AssignSpecializationService } from "../services/assign-specialization.service.js";

export class AssignSpecializationController {
  constructor(
    private readonly assignSpecializationService: AssignSpecializationService,
  ) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const data = res.locals.body;

    const relation = await this.assignSpecializationService.execute(data);

    res.status(201).json({
      status: "success",
      data: relation,
    });
  }
}
