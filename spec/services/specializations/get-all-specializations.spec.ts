import { describe, expect, it, jest } from "@jest/globals";

import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import { GetAllSpecializationsService } from "../../../src/modules/specializations/services/get-all-specializations.service.js";

const mockGetAllSpecializations = jest.fn<() => Promise<Specialization[]>>();

const mockRepository = {
  getAllSpecializations: mockGetAllSpecializations,
} as unknown as ISpecializationRepository;

describe("GetAllSpecializationsService", () => {
  const service = new GetAllSpecializationsService(mockRepository);

  it("Should return all specializations successfully", async () => {
    const specializations = [
      {
        id: "1",
        name: "CBT",
        slug: "cbt",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as Specialization[];

    mockGetAllSpecializations.mockResolvedValue(specializations);

    const result = await service.execute();

    expect(result).toEqual(specializations);
    expect(mockGetAllSpecializations).toHaveBeenCalled();
  });

  it("Should return error when repository fails", async () => {
    mockGetAllSpecializations.mockRejectedValue(new Error("Database error"));

    await expect(service.execute()).rejects.toThrow("Database error");
  });
});
