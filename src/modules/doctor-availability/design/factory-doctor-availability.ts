import { CreateDoctorAvailabilityController } from "../controllers/create-doctor-availability.controller.js";
import { DeleteDoctorAvailabilityController } from "../controllers/delete-doctor-availability.controller.js";
import { GetAllDoctorAvailabilityController } from "../controllers/get-all-doctor-availability.controller.js";
import { GetDoctorAvailabilityByIdController } from "../controllers/get-doctor-availability-byId.controller.js";
import { UpdateDoctorAvailabilityController } from "../controllers/update-doctor-availability.controller.js";

import { PrismaDoctorAvailabilityRepository } from "../repository/prisma-doctor-availability.js";
import { PrismaDoctorRepository } from "../../doctors/repository/prisma.repository.js";

import { CreateDoctorAvailabilityService } from "../services/create-doctor-availability.service.js";
import { DeleteDoctorAvailabilityService } from "../services/delete-doctor-availability.service.js";
import { GetAllDoctorAvailabilityService } from "../services/get-all-doctor-availability.service.js";
import { GetDoctorAvailabilityByIdService } from "../services/get-doctor-availability-byId.service.js";
import { UpdateDoctorAvailabilityService } from "../services/update-doctor-availability.service.js";

const doctorAvailabilityRepository = new PrismaDoctorAvailabilityRepository();

const doctorRepository = new PrismaDoctorRepository();

export const MakeCreateDoctorAvailabilityController = () => {
  const service = new CreateDoctorAvailabilityService(
    doctorAvailabilityRepository,
    doctorRepository,
  );

  return new CreateDoctorAvailabilityController(service);
};

export const MakeGetAllDoctorAvailabilityController = () => {
  const service = new GetAllDoctorAvailabilityService(
    doctorAvailabilityRepository,
    doctorRepository,
  );

  return new GetAllDoctorAvailabilityController(service);
};

export const MakeGetDoctorAvailabilityByIdController = () => {
  const service = new GetDoctorAvailabilityByIdService(
    doctorAvailabilityRepository,
  );

  return new GetDoctorAvailabilityByIdController(service);
};

export const MakeUpdateDoctorAvailabilityController = () => {
  const service = new UpdateDoctorAvailabilityService(
    doctorAvailabilityRepository,
    doctorRepository,
  );

  return new UpdateDoctorAvailabilityController(service);
};

export const MakeDeleteDoctorAvailabilityController = () => {
  const service = new DeleteDoctorAvailabilityService(
    doctorAvailabilityRepository,
    doctorRepository,
  );

  return new DeleteDoctorAvailabilityController(service);
};
