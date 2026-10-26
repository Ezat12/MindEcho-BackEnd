import { describe, expect, it, jest } from "@jest/globals";

import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import { UpdateSpecializationService } from "../../../src/modules/specializations/services/update-specialization.service.js";

const mockGetSpecializationById =
  jest.fn<(id: string) => Promise<Specialization | null>>();
const mockUpdateSpecialization =
  jest.fn<
    (
      id: string,
      data: { name?: string },
      slug?: string | undefined,
    ) => Promise<Specialization>
  >();
const mockFindByName =
  jest.fn<(name: string) => Promise<Specialization | null>>();
const mockFindBySlug =
  jest.fn<(slug: string) => Promise<Specialization | null>>();

const mockRepository = {
  getSpecializationById: mockGetSpecializationById,
  updateSpecialization: mockUpdateSpecialization,
  findByName: mockFindByName,
  findBySlug: mockFindBySlug,
} as unknown as ISpecializationRepository;

describe("UpdateSpecializationService", () => {
  const service = new UpdateSpecializationService(mockRepository);

  it("Should return error when specialization does not exist", async () => {
    mockGetSpecializationById.mockResolvedValue(null);

    await expect(service.execute("1", { name: "CBT" })).rejects.toThrow(
      "Specialization not found",
    );
  });

  it("Should return error when name already exists on another specialization", async () => {
    mockGetSpecializationById.mockResolvedValue({
      id: "1",
      name: "Old",
      slug: "old",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockFindByName.mockResolvedValue({
      id: "2",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.execute("1", { name: "CBT" })).rejects.toThrow(
      "Specialization already exists",
    );
  });

  it("Should update specialization successfully", async () => {
    const existing = {
      id: "1",
      name: "Old",
      slug: "old",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Specialization;
    const updated = { ...existing, name: "CBT", slug: "cbt" };

    mockGetSpecializationById.mockResolvedValue(existing);
    mockFindByName.mockResolvedValue(null);
    mockFindBySlug.mockResolvedValue(null);
    mockUpdateSpecialization.mockResolvedValue(updated);

    const result = await service.execute("1", { name: "CBT" });

    expect(result).toEqual(updated);
    expect(mockUpdateSpecialization).toHaveBeenCalledWith(
      "1",
      { name: "CBT" },
      "cbt",
    );
  });
});
