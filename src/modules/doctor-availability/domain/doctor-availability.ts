export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
