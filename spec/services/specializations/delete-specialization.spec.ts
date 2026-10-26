import { describe, expect, it, jest } from "@jest/globals";

import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import { DeleteSpecializationService } from "../../../src/modules/specializations/services/delete-specialization.service.js";

const mockGetSpecializationById =
  jest.fn<(id: string) => Promise<Specialization | null>>();
const mockDeleteSpecialization = jest.fn<(id: string) => Promise<void>>();

const mockRepository = {
  getSpecializationById: mockGetSpecializationById,
  deleteSpecialization: mockDeleteSpecialization,
} as unknown as ISpecializationRepository;

describe("DeleteSpecializationService", () => {
  const service = new DeleteSpecializationService(mockRepository);

  it("Should return error when specialization does not exist", async () => {
    mockGetSpecializationById.mockResolvedValue(null);

    await expect(service.execute("1")).rejects.toThrow(
      "Specialization not found",
    );
  });

  it("Should delete specialization successfully", async () => {
    mockGetSpecializationById.mockResolvedValue({
      id: "1",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockDeleteSpecialization.mockResolvedValue();

    await service.execute("1");

    expect(mockDeleteSpecialization).toHaveBeenCalledWith("1");
  });
});
