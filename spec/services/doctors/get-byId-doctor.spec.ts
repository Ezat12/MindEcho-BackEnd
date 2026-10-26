import { describe, expect, it, jest } from "@jest/globals";

import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import { GetDoctorByIdService } from "../../../src/modules/doctors/services/get-byId-doctor.service.js";

const mockGetDoctorById =
  jest.fn<(id: string) => Promise<Doctor | null>>();

const mockRepository = {
  getDoctorById: mockGetDoctorById,
} as unknown as IDoctorRepository;

describe("GetDoctorByIdService", () => {
  const service = new GetDoctorByIdService(mockRepository);

  it("Should return doctor successfully", async () => {
    const doctor = {
      id: "1",
      userId: "user-1",
      name: "Dr Test",
      bio: null,
      price: 200,
      sessionDurationMinutes: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Doctor;

    mockGetDoctorById.mockResolvedValue(doctor);

    const result = await service.execute("1");

    expect(result).toEqual(doctor);
  });

  it("Should return error when doctor does not exist", async () => {
    mockGetDoctorById.mockResolvedValue(null);

    await expect(service.execute("1")).rejects.toThrow("Doctor not found");
  });
});
