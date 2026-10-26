import { describe, expect, it, jest } from "@jest/globals";

import type { DoctorSpecialization } from "../../../src/modules/doctor-specialization/domain/doctor-specialization.js";
import type { IDoctorSpecializationRepository } from "../../../src/modules/doctor-specialization/repository/doctor-specialization.repository.js";
import { RemoveSpecializationService } from "../../../src/modules/doctor-specialization/services/remove-specialization.service.js";

const mockFindById =
  jest.fn<(id: string) => Promise<DoctorSpecialization | null>>();
const mockRemove = jest.fn<(id: string) => Promise<void>>();

const mockRepository = {
  findById: mockFindById,
  remove: mockRemove,
} as unknown as IDoctorSpecializationRepository;

describe("RemoveSpecializationService", () => {
  const service = new RemoveSpecializationService(mockRepository);

  it("Should return error when relation does not exist", async () => {
    mockFindById.mockResolvedValue(null);

    await expect(service.execute("rel-1")).rejects.toThrow(
      "Doctor specialization not found",
    );
  });

  it("Should remove relation successfully", async () => {
    mockFindById.mockResolvedValue({
      id: "rel-1",
      doctorId: "doctor-1",
      specializationId: "spec-1",
    });
    mockRemove.mockResolvedValue();

    await service.execute("rel-1");

    expect(mockRemove).toHaveBeenCalledWith("rel-1");
  });
});
