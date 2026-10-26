import { describe, expect, it, jest } from "@jest/globals";

import type { DoctorSpecialization } from "../../../src/modules/doctor-specialization/domain/doctor-specialization.js";
import type { IDoctorSpecializationRepository } from "../../../src/modules/doctor-specialization/repository/doctor-specialization.repository.js";
import { RemoveSpecializationByPairService } from "../../../src/modules/doctor-specialization/services/remove-by-pair.service.js";

const mockFindByDoctorAndSpecialization =
  jest.fn<
    (
      doctorId: string,
      specializationId: string,
    ) => Promise<DoctorSpecialization | null>
  >();
const mockRemove = jest.fn<(id: string) => Promise<void>>();

const mockRepository = {
  findByDoctorAndSpecialization: mockFindByDoctorAndSpecialization,
  remove: mockRemove,
} as unknown as IDoctorSpecializationRepository;

describe("RemoveSpecializationByPairService", () => {
  const service = new RemoveSpecializationByPairService(mockRepository);

  it("Should return error when relation does not exist", async () => {
    mockFindByDoctorAndSpecialization.mockResolvedValue(null);

    await expect(service.execute("doctor-1", "spec-1")).rejects.toThrow(
      "Doctor specialization not found",
    );
  });

  it("Should remove relation by pair successfully", async () => {
    mockFindByDoctorAndSpecialization.mockResolvedValue({
      id: "rel-1",
      doctorId: "doctor-1",
      specializationId: "spec-1",
    });
    mockRemove.mockResolvedValue();

    await service.execute("doctor-1", "spec-1");

    expect(mockRemove).toHaveBeenCalledWith("rel-1");
  });
});
