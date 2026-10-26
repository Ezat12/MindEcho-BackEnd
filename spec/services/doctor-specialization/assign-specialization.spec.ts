import { describe, expect, it, jest } from "@jest/globals";

import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import type { Specialization } from "../../../src/modules/specializations/domain/specialization.js";
import type { ISpecializationRepository } from "../../../src/modules/specializations/repository/specialization.repository.js";
import type { DoctorSpecialization } from "../../../src/modules/doctor-specialization/domain/doctor-specialization.js";
import type { AssignSpecializationDTO } from "../../../src/modules/doctor-specialization/dto/assign-specialization.dto.js";
import type { IDoctorSpecializationRepository } from "../../../src/modules/doctor-specialization/repository/doctor-specialization.repository.js";
import { AssignSpecializationService } from "../../../src/modules/doctor-specialization/services/assign-specialization.service.js";

const mockGetDoctorById =
  jest.fn<(id: string) => Promise<Doctor | null>>();
const mockGetSpecializationById =
  jest.fn<(id: string) => Promise<Specialization | null>>();
const mockFindByDoctorAndSpecialization =
  jest.fn<
    (
      doctorId: string,
      specializationId: string,
    ) => Promise<DoctorSpecialization | null>
  >();
const mockAssign =
  jest.fn<(data: AssignSpecializationDTO) => Promise<DoctorSpecialization>>();

const mockDoctorRepository = {
  getDoctorById: mockGetDoctorById,
} as unknown as IDoctorRepository;

const mockSpecializationRepository = {
  getSpecializationById: mockGetSpecializationById,
} as unknown as ISpecializationRepository;

const mockDoctorSpecializationRepository = {
  findByDoctorAndSpecialization: mockFindByDoctorAndSpecialization,
  assign: mockAssign,
} as unknown as IDoctorSpecializationRepository;

const payload: AssignSpecializationDTO = {
  doctorId: "doctor-1",
  specializationId: "spec-1",
};

describe("AssignSpecializationService", () => {
  const service = new AssignSpecializationService(
    mockDoctorSpecializationRepository,
    mockDoctorRepository,
    mockSpecializationRepository,
  );

  it("Should return error when doctor does not exist", async () => {
    mockGetDoctorById.mockResolvedValue(null);

    await expect(service.execute(payload)).rejects.toThrow("Doctor not found");
  });

  it("Should return error when specialization does not exist", async () => {
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
    mockGetSpecializationById.mockResolvedValue(null);

    await expect(service.execute(payload)).rejects.toThrow(
      "Specialization not found",
    );
  });

  it("Should return error when specialization is already assigned", async () => {
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
    mockGetSpecializationById.mockResolvedValue({
      id: "spec-1",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockFindByDoctorAndSpecialization.mockResolvedValue({
      id: "rel-1",
      doctorId: "doctor-1",
      specializationId: "spec-1",
    });

    await expect(service.execute(payload)).rejects.toThrow(
      "Specialization already assigned to this doctor",
    );
  });

  it("Should assign specialization successfully", async () => {
    const relation = {
      id: "rel-1",
      doctorId: "doctor-1",
      specializationId: "spec-1",
    } as DoctorSpecialization;

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
    mockGetSpecializationById.mockResolvedValue({
      id: "spec-1",
      name: "CBT",
      slug: "cbt",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockFindByDoctorAndSpecialization.mockResolvedValue(null);
    mockAssign.mockResolvedValue(relation);

    const result = await service.execute(payload);

    expect(result).toEqual(relation);
    expect(mockAssign).toHaveBeenCalledWith(payload);
  });
});
