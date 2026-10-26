import { describe, expect, it, jest } from "@jest/globals";

import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import { GetSpecializationByIdService } from "../../../src/modules/specializations/services/get-byId-specialization.service.js";

const mockGetSpecializationById =
  jest.fn<(id: string) => Promise<Specialization | null>>();

const mockRepository = {
  getSpecializationById: mockGetSpecializationById,
} as unknown as ISpecializationRepository;

describe("GetSpecializationByIdService", () => {
  const service = new GetSpecializationByIdService(mockRepository);

  it("Should return specialization successfully", async () => {
    const specialization = {
      id: "1",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Specialization;

    mockGetSpecializationById.mockResolvedValue(specialization);

    const result = await service.execute("1");

    expect(result).toEqual(specialization);
    expect(mockGetSpecializationById).toHaveBeenCalledWith("1");
  });

  it("Should return error when specialization does not exist", async () => {
    mockGetSpecializationById.mockResolvedValue(null);

    await expect(service.execute("1")).rejects.toThrow(
      "Specialization not found",
    );
  });
});
