import { PrismaDoctorRepository } from "../../doctors/repository/prisma.repository.js";
import { PrismaSpecializationRepository } from "../../specializations/repository/prisma.repository.js";
import { AssignSpecializationController } from "../controllers/assign-specialization.controller.js";
import { GetSpecializationsByDoctorController } from "../controllers/get-by-doctor.controller.js";
import { GetDoctorsBySpecializationController } from "../controllers/get-by-specialization.controller.js";
import { RemoveSpecializationByPairController } from "../controllers/remove-by-pair.controller.js";
import { RemoveSpecializationController } from "../controllers/remove-specialization.controller.js";
import { PrismaDoctorSpecializationRepository } from "../repository/prisma.repository.js";
import { AssignSpecializationService } from "../services/assign-specialization.service.js";
import { GetSpecializationsByDoctorService } from "../services/get-by-doctor.service.js";
import { GetDoctorsBySpecializationService } from "../services/get-by-specialization.service.js";
import { RemoveSpecializationByPairService } from "../services/remove-by-pair.service.js";
import { RemoveSpecializationService } from "../services/remove-specialization.service.js";

const doctorSpecializationRepository = new PrismaDoctorSpecializationRepository();
const doctorRepository = new PrismaDoctorRepository();
const specializationRepository = new PrismaSpecializationRepository();

export const MakeAssignSpecializationController = () => {
  const service = new AssignSpecializationService(
    doctorSpecializationRepository,
    doctorRepository,
    specializationRepository,
  );

  return new AssignSpecializationController(service);
};

export const MakeRemoveSpecializationController = () => {
  const service = new RemoveSpecializationService(
    doctorSpecializationRepository,
  );

  return new RemoveSpecializationController(service);
};

export const MakeRemoveSpecializationByPairController = () => {
  const service = new RemoveSpecializationByPairService(
    doctorSpecializationRepository,
  );

  return new RemoveSpecializationByPairController(service);
};

export const MakeGetSpecializationsByDoctorController = () => {
  const service = new GetSpecializationsByDoctorService(
    doctorSpecializationRepository,
    doctorRepository,
  );

  return new GetSpecializationsByDoctorController(service);
};

export const MakeGetDoctorsBySpecializationController = () => {
  const service = new GetDoctorsBySpecializationService(
    doctorSpecializationRepository,
    specializationRepository,
  );

  return new GetDoctorsBySpecializationController(service);
};
