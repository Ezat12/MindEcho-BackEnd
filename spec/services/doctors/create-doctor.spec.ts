import { describe, expect, it, jest } from "@jest/globals";

import type { User } from "../../../src/modules/users/domain/user.js";
import type { IUserRepository } from "../../../src/modules/users/repositories/user-repository.js";
import type { Doctor } from "../../../src/modules/doctors/domain/doctor.js";
import type { CreateDoctorDTO } from "../../../src/modules/doctors/dto/create-doctor.dto.js";
import type { IDoctorRepository } from "../../../src/modules/doctors/repository/doctor.repository.js";
import { CreateDoctorService } from "../../../src/modules/doctors/services/create-doctor.service.js";

const mockGetById = jest.fn<(id: string) => Promise<User | null>>();
const mockFindByUserId =
  jest.fn<(userId: string) => Promise<Doctor | null>>();
const mockCreateDoctor =
  jest.fn<(data: CreateDoctorDTO) => Promise<Doctor>>();

const mockDoctorRepository = {
  findByUserId: mockFindByUserId,
  createDoctor: mockCreateDoctor,
} as unknown as IDoctorRepository;

const mockUserRepository = {
  getById: mockGetById,
} as unknown as IUserRepository;

const doctorPayload: CreateDoctorDTO = {
  userId: "user-1",
  name: "Dr Test",
  bio: "Therapist",
  price: 200,
  sessionDurationMinutes: 45,
};

describe("CreateDoctorService", () => {
  const service = new CreateDoctorService(
    mockDoctorRepository,
    mockUserRepository,
  );

  it("Should return error when user does not exist", async () => {
    mockGetById.mockResolvedValue(null);

    await expect(service.execute(doctorPayload)).rejects.toThrow(
      "User not found",
    );
  });

  it("Should return error when user is not a doctor", async () => {
    mockGetById.mockResolvedValue({
      id: "user-1",
      email: "client@example.com",
      password: "hashed",
      name: "Client",
      role: "CLIENT",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);

    await expect(service.execute(doctorPayload)).rejects.toThrow(
      "User is not a doctor",
    );
  });

  it("Should return error when doctor profile already exists", async () => {
    mockGetById.mockResolvedValue({
      id: "user-1",
      email: "doctor@example.com",
      password: "hashed",
      name: "Dr Test",
      role: "DOCTOR",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);
    mockFindByUserId.mockResolvedValue({
      id: "doctor-1",
      userId: "user-1",
      name: "Dr Test",
      bio: null,
      price: 200,
      sessionDurationMinutes: 45,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(service.execute(doctorPayload)).rejects.toThrow(
      "Doctor profile already exists for this user",
    );
  });

  it("Should create doctor successfully", async () => {
    const created = {
      id: "doctor-1",
      ...doctorPayload,
      bio: doctorPayload.bio ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Doctor;

    mockGetById.mockResolvedValue({
      id: "user-1",
      email: "doctor@example.com",
      password: "hashed",
      name: "Dr Test",
      role: "DOCTOR",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User);
    mockFindByUserId.mockResolvedValue(null);
    mockCreateDoctor.mockResolvedValue(created);

    const result = await service.execute(doctorPayload);

    expect(result).toEqual(created);
    expect(mockCreateDoctor).toHaveBeenCalledWith(doctorPayload);
  });
});
