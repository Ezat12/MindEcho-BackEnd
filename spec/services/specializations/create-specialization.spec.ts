import { describe, expect, it, jest } from "@jest/globals";

import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { CreateSpecializationDTO } from "../../../src/modules/specializations/dto/create-specialization.dto.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import { CreateSpecializationService } from "../../../src/modules/specializations/services/create-specialization.service.js";

const mockCreateSpecialization =
  jest.fn<
    (data: CreateSpecializationDTO, slug: string) => Promise<Specialization>
  >();
const mockFindByName =
  jest.fn<(name: string) => Promise<Specialization | null>>();
const mockFindBySlug =
  jest.fn<(slug: string) => Promise<Specialization | null>>();

const mockRepository = {
  createSpecialization: mockCreateSpecialization,
  findByName: mockFindByName,
  findBySlug: mockFindBySlug,
} as unknown as ISpecializationRepository;

describe("CreateSpecializationService", () => {
  const service = new CreateSpecializationService(mockRepository);

  it("Should return error when specialization name already exists", async () => {
    mockFindByName.mockResolvedValue({
      id: "1",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.execute({ name: "CBT" })).rejects.toThrow(
      "Specialization already exists",
    );
  });

  it("Should return error when specialization slug already exists", async () => {
    mockFindByName.mockResolvedValue(null);
    mockFindBySlug.mockResolvedValue({
      id: "1",
      name: "C B T",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.execute({ name: "CBT" })).rejects.toThrow(
      "Specialization already exists",
    );
  });

  it("Should create specialization successfully", async () => {
    const created = {
      id: "1",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Specialization;

    mockFindByName.mockResolvedValue(null);
    mockFindBySlug.mockResolvedValue(null);
    mockCreateSpecialization.mockResolvedValue(created);

    const result = await service.execute({ name: "CBT" });

    expect(result).toEqual(created);
    expect(mockCreateSpecialization).toHaveBeenCalledWith(
      { name: "CBT" },
      "cbt",
    );
  });

  it("Should return error when repository fails", async () => {
    mockFindByName.mockResolvedValue(null);
    mockFindBySlug.mockResolvedValue(null);
    mockCreateSpecialization.mockRejectedValue(new Error("Database error"));

    await expect(service.execute({ name: "CBT" })).rejects.toThrow(
      "Database error",
    );
  });
});
