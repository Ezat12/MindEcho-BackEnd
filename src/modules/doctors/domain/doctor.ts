import type { Specialization } from "../../specializations/domain/specialization.js";

export interface DoctorUserSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
}

export interface DoctorSpecializationSummary {
  id: string;
  doctorId: string;
  specializationId: string;
  specialization: Specialization;
}

export interface Doctor {
  id: string;
  userId: string;
  // name: string;
  bio: string | null;
  price: number;
  sessionDurationMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  user?: DoctorUserSummary;
  doctorSpecializations?: DoctorSpecializationSummary[];
}
