import { describe, expect, it, jest } from "@jest/globals";

import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import type { DoctorSpecialization } from "../../../src/modules/doctor-specialization/domain/doctor-specialization.js";
import type { IDoctorSpecializationRepository } from "../../../src/modules/doctor-specialization/repository/doctor-specialization.repository.js";
import { GetDoctorsBySpecializationService } from "../../../src/modules/doctor-specialization/services/get-by-specialization.service.js";

const mockGetSpecializationById =
  jest.fn<(id: string) => Promise<Specialization | null>>();
const mockGetBySpecializationId =
  jest.fn<(specializationId: string) => Promise<DoctorSpecialization[]>>();

const mockSpecializationRepository = {
  getSpecializationById: mockGetSpecializationById,
} as unknown as ISpecializationRepository;

const mockDoctorSpecializationRepository = {
  getBySpecializationId: mockGetBySpecializationId,
} as unknown as IDoctorSpecializationRepository;

describe("GetDoctorsBySpecializationService", () => {
  const service = new GetDoctorsBySpecializationService(
    mockDoctorSpecializationRepository,
    mockSpecializationRepository,
  );

  it("Should return error when specialization does not exist", async () => {
    mockGetSpecializationById.mockResolvedValue(null);

    await expect(service.execute("spec-1")).rejects.toThrow(
      "Specialization not found",
    );
  });

  it("Should return doctors by specialization successfully", async () => {
    mockGetSpecializationById.mockResolvedValue({
      id: "spec-1",
      name: "CBT",
      slug: "cbt",
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

    mockGetBySpecializationId.mockResolvedValue(relations);

    const result = await service.execute("spec-1");

    expect(result).toEqual(relations);
    expect(mockGetBySpecializationId).toHaveBeenCalledWith("spec-1");
  });
});
