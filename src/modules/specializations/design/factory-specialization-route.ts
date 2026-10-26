import { CreateSpecializationController } from "../controllers/create-specialization.controller.js";
import { DeleteSpecializationController } from "../controllers/delete-specialization.controller.js";
import { GetAllSpecializationsController } from "../controllers/get-all-specializations.controller.js";
import { GetSpecializationByIdController } from "../controllers/get-byId-specialization.controller.js";
import { UpdateSpecializationController } from "../controllers/update-specialization.controller.js";
import { PrismaSpecializationRepository } from "../repository/prisma.repository.js";
import { CreateSpecializationService } from "../services/create-specialization.service.js";
import { DeleteSpecializationService } from "../services/delete-specialization.service.js";
import { GetAllSpecializationsService } from "../services/get-all-specializations.service.js";
import { GetSpecializationByIdService } from "../services/get-byId-specialization.service.js";
import { UpdateSpecializationService } from "../services/update-specialization.service.js";

const specializationRepository = new PrismaSpecializationRepository();

export const MakeCreateSpecializationController = () => {
  const service = new CreateSpecializationService(specializationRepository);

  return new CreateSpecializationController(service);
};

export const MakeGetAllSpecializationsController = () => {
  const service = new GetAllSpecializationsService(specializationRepository);

  return new GetAllSpecializationsController(service);
};

export const MakeGetSpecializationByIdController = () => {
  const service = new GetSpecializationByIdService(specializationRepository);

  return new GetSpecializationByIdController(service);
};

export const MakeUpdateSpecializationController = () => {
  const service = new UpdateSpecializationService(specializationRepository);

  return new UpdateSpecializationController(service);
};

export const MakeDeleteSpecializationController = () => {
  const service = new DeleteSpecializationService(specializationRepository);

  return new DeleteSpecializationController(service);
};
