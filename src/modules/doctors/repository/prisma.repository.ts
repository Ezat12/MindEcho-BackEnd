import { prisma } from "config/prisma.js";
import type { Doctor } from "../domain/doctor.js";
import type { CreateDoctorDTO } from "../dto/create-doctor.dto.js";
import type { PaginationDoctorDTO } from "../dto/pagination-doctor.dto.js";
import type { UpdateDoctorDTO } from "../dto/update-doctor.dto.js";
import type { IDoctorRepository } from "./doctor.repository.js";

const doctorInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      bio: true,
      role: true,
    },
  },
  doctorSpecializations: {
    include: {
      specialization: true,
    },
  },
} as const;

const toDoctor = (doctor: {
  id: string;
  userId: string;
  // name: string;
  bio: string | null;
  price: { toString(): string } | number;
  sessionDurationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  user?: Doctor["user"];
  doctorSpecializations?: Doctor["doctorSpecializations"];
}): Doctor => {
  return {
    id: doctor.id,
    userId: doctor.userId,
    // name: doctor.name,
    bio: doctor.bio,
    price: Number(doctor.price),
    sessionDurationMinutes: doctor.sessionDurationMinutes,
    createdAt: doctor.createdAt,
    updatedAt: doctor.updatedAt,
    ...(doctor.user !== undefined && { user: doctor.user }),
    ...(doctor.doctorSpecializations !== undefined && {
      doctorSpecializations: doctor.doctorSpecializations,
    }),
  };
};

export class PrismaDoctorRepository implements IDoctorRepository {
  async createDoctor(data: CreateDoctorDTO): Promise<Doctor> {
    const doctor = await prisma.doctors.create({
      data: {
        userId: data.userId,
        bio: data.bio ?? null,
        price: data.price,
        sessionDurationMinutes: data.sessionDurationMinutes,
      },
      include: doctorInclude,
    });

    return toDoctor(doctor);
  }

  async updateDoctor(id: string, data: UpdateDoctorDTO): Promise<Doctor> {
    const doctor = await prisma.doctors.update({
      where: { id },
      data: {
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.sessionDurationMinutes !== undefined && {
          sessionDurationMinutes: data.sessionDurationMinutes,
        }),
      },
      include: doctorInclude,
    });

    return toDoctor(doctor);
  }

  async getAllDoctors(
    query: PaginationDoctorDTO,
  ): Promise<{ doctors: Doctor[]; total: number }> {
    const skip = (query.page - 1) * query.limit;

    const where = {
      ...(query.search && {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
          {
            bio: {
              contains: query.search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
      ...(query.specializationId && {
        doctorSpecializations: {
          some: {
            specializationId: query.specializationId,
          },
        },
      }),
    };

    const [doctors, total] = await prisma.$transaction([
      prisma.doctors.findMany({
        skip,
        take: query.limit,
        where,
        orderBy: {
          [query.sort]: query.order,
        },
        include: doctorInclude,
      }),
      prisma.doctors.count({ where }),
    ]);

    return {
      doctors: doctors.map(toDoctor),
      total,
    };
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    const doctor = await prisma.doctors.findUnique({
      where: { id },
      include: doctorInclude,
    });

    return doctor ? toDoctor(doctor) : null;
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    const doctor = await prisma.doctors.findUnique({
      where: { userId },
      include: doctorInclude,
    });

    return doctor ? toDoctor(doctor) : null;
  }

  async deleteDoctor(id: string): Promise<void> {
    await prisma.doctors.delete({
      where: { id },
    });
  }
}
