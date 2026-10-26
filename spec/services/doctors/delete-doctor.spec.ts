import { describe, expect, it, jest } from "@jest/globals";

import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import { DeleteDoctorService } from "../../../src/modules/doctors/services/delete-doctor.service.js";

const mockGetDoctorById =
  jest.fn<(id: string) => Promise<Doctor | null>>();
const mockDeleteDoctor = jest.fn<(id: string) => Promise<void>>();

const mockRepository = {
  getDoctorById: mockGetDoctorById,
  deleteDoctor: mockDeleteDoctor,
} as unknown as IDoctorRepository;

describe("DeleteDoctorService", () => {
  const service = new DeleteDoctorService(mockRepository);

  it("Should return error when doctor does not exist", async () => {
    mockGetDoctorById.mockResolvedValue(null);

    await expect(service.execute("1")).rejects.toThrow("Doctor not found");
  });

  it("Should delete doctor successfully", async () => {
    mockGetDoctorById.mockResolvedValue({
      id: "1",
      userId: "user-1",
      name: "Dr Test",
      bio: null,
      price: 200,
      sessionDurationMinutes: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockDeleteDoctor.mockResolvedValue();

    await service.execute("1");

    expect(mockDeleteDoctor).toHaveBeenCalledWith("1");
  });
});
