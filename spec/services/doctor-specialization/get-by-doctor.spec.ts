import { describe, expect, it, jest } from "@jest/globals";

import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import type { DoctorSpecialization } from "../../../src/modules/doctor-specialization/domain/doctor-specialization.js";
import type { IDoctorSpecializationRepository } from "../../../src/modules/doctor-specialization/repository/doctor-specialization.repository.js";
import { GetSpecializationsByDoctorService } from "../../../src/modules/doctor-specialization/services/get-by-doctor.service.js";

const mockGetDoctorById =
  jest.fn<(id: string) => Promise<Doctor | null>>();
const mockGetByDoctorId =
  jest.fn<(doctorId: string) => Promise<DoctorSpecialization[]>>();

const mockDoctorRepository = {
  getDoctorById: mockGetDoctorById,
} as unknown as IDoctorRepository;

const mockDoctorSpecializationRepository = {
  getByDoctorId: mockGetByDoctorId,
} as unknown as IDoctorSpecializationRepository;

describe("GetSpecializationsByDoctorService", () => {
  const service = new GetSpecializationsByDoctorService(
    mockDoctorSpecializationRepository,
    mockDoctorRepository,
  );

  it("Should return error when doctor does not exist", async () => {
    mockGetDoctorById.mockResolvedValue(null);

    await expect(service.execute("doctor-1")).rejects.toThrow(
      "Doctor not found",
    );
  });

  it("Should return doctor specializations successfully", async () => {
    mockGetDoctorById.mockResolvedValue({
      id: "doctor-1",
      userId: "user-1",
      name: "Dr Test",
      bio: null,
      price: 200,
      sessionDurationMinutes: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const relations = [
      {
        id: "rel-1",
        doctorId: "doctor-1",
        specializationId: "spec-1",
      },
    ] as DoctorSpecialization[];

    mockGetByDoctorId.mockResolvedValue(relations);

    const result = await service.execute("doctor-1");

    expect(result).toEqual(relations);
    expect(mockGetByDoctorId).toHaveBeenCalledWith("doctor-1");
  });
});
