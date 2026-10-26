import { PrismaUserRepository } from "../../users/repositories/prisma-user.repository.js";
import { CreateDoctorController } from "../controllers/create-doctor.controller.js";
import { DeleteDoctorController } from "../controllers/delete-doctor.controller.js";
import { GetAllDoctorsController } from "../controllers/get-all-doctors.controller.js";
import { GetDoctorByIdController } from "../controllers/get-byId-doctor.controller.js";
import { UpdateDoctorController } from "../controllers/update-doctor.controller.js";
import { PrismaDoctorRepository } from "../repository/prisma.repository.js";
import { CreateDoctorService } from "../services/create-doctor.service.js";
import { DeleteDoctorService } from "../services/delete-doctor.service.js";
import { GetAllDoctorsService } from "../services/get-all-doctors.service.js";
import { GetDoctorByIdService } from "../services/get-byId-doctor.service.js";
import { UpdateDoctorService } from "../services/update-doctor.service.js";

const doctorRepository = new PrismaDoctorRepository();
const userRepository = new PrismaUserRepository();

export const MakeCreateDoctorController = () => {
  const service = new CreateDoctorService(doctorRepository, userRepository);

  return new CreateDoctorController(service);
};

export const MakeGetAllDoctorsController = () => {
  const service = new GetAllDoctorsService(doctorRepository);

  return new GetAllDoctorsController(service);
};

export const MakeGetDoctorByIdController = () => {
  const service = new GetDoctorByIdService(doctorRepository);

  return new GetDoctorByIdController(service);
};

export const MakeUpdateDoctorController = () => {
  const service = new UpdateDoctorService(doctorRepository);

  return new UpdateDoctorController(service);
};

export const MakeDeleteDoctorController = () => {
  const service = new DeleteDoctorService(doctorRepository);

  return new DeleteDoctorController(service);
};
