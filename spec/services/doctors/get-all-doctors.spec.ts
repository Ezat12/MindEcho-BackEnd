import { describe, expect, it, jest } from "@jest/globals";

import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { PaginationDoctorDTO } from "../../../src/modules/doctors/dto/pagination-doctor.dto.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import { GetAllDoctorsService } from "../../../src/modules/doctors/services/get-all-doctors.service.js";

const mockGetAllDoctors =
  jest.fn<
    (query: PaginationDoctorDTO) => Promise<{ doctors: Doctor[]; total: number }>
  >();

const mockRepository = {
  getAllDoctors: mockGetAllDoctors,
} as unknown as IDoctorRepository;

describe("GetAllDoctorsService", () => {
  const service = new GetAllDoctorsService(mockRepository);

  it("Should return doctors with total pages", async () => {
    const doctors = [
      {
        id: "1",
        userId: "user-1",
        name: "Dr Test",
        bio: null,
        price: 200,
        sessionDurationMinutes: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as Doctor[];

    const query = {
      page: 1,
      limit: 10,
      sort: "createdAt",
      order: "desc",
    } as PaginationDoctorDTO;

    mockGetAllDoctors.mockResolvedValue({ doctors, total: 11 });

    const result = await service.execute(query);

    expect(result).toEqual({ doctors, total: 11, totalPages: 2 });
    expect(mockGetAllDoctors).toHaveBeenCalledWith(query);
  });
});
