import { describe, expect, it, jest } from "@jest/globals";

import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { UpdateDoctorDTO } from "../../../src/modules/doctors/dto/update-doctor.dto.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import { UpdateDoctorService } from "../../../src/modules/doctors/services/update-doctor.service.js";

const mockGetDoctorById =
  jest.fn<(id: string) => Promise<Doctor | null>>();
const mockUpdateDoctor =
  jest.fn<(id: string, data: UpdateDoctorDTO) => Promise<Doctor>>();

const mockRepository = {
  getDoctorById: mockGetDoctorById,
  updateDoctor: mockUpdateDoctor,
} as unknown as IDoctorRepository;

describe("UpdateDoctorService", () => {
  const service = new UpdateDoctorService(mockRepository);

  it("Should return error when doctor does not exist", async () => {
    mockGetDoctorById.mockResolvedValue(null);

    await expect(service.execute("1", { price: 250 })).rejects.toThrow(
      "Doctor not found",
    );
  });

  it("Should update doctor successfully", async () => {
    const existing = {
      id: "1",
      userId: "user-1",
      name: "Dr Test",
      bio: null,
      price: 200,
      sessionDurationMinutes: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Doctor;
    const updated = { ...existing, price: 250 };

    mockGetDoctorById.mockResolvedValue(existing);
    mockUpdateDoctor.mockResolvedValue(updated);

    const result = await service.execute("1", { price: 250 });

    expect(result).toEqual(updated);
    expect(mockUpdateDoctor).toHaveBeenCalledWith("1", { price: 250 });
  });
});
