import type { Request, Response } from "express";
import type { PaginationDoctorDTO } from "../dto/pagination-doctor.dto.js";
import type { GetAllDoctorsService } from "../services/get-all-doctors.service.js";

export class GetAllDoctorsController {
  constructor(private readonly getAllDoctorsService: GetAllDoctorsService) {
    this.handle = this.handle.bind(this);
  }

  async handle(req: Request, res: Response) {
    const queryParams = res.locals.query as PaginationDoctorDTO;

    const { doctors, total, totalPages } =
      await this.getAllDoctorsService.execute(queryParams);

    res.status(200).json({
      status: "success",
      data: doctors,
      meta: {
        page: queryParams.page,
        limit: queryParams.limit,
        total,
        totalPages,
      },
    });
  }
}
