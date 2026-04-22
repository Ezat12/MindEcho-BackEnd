import { CreateUserController } from "../controllers/create-user.controller.js";
import { DeleteUserController } from "../controllers/delete-user.controller.js";
import { GetUsersController } from "../controllers/get-users.controller.js";
import { GetByIdUserController } from "../controllers/getById-user.controller.js";
import { UpdateUserController } from "../controllers/update-user.controller.js";
import { PrismaUserRepository } from "../repositories/prisma-user.repository.js";
import { CreateUserService } from "../services/create-user.service.js";
import { DeleteUserService } from "../services/delete-user.service.js";
import { GetAllUsersService } from "../services/get-users.service.js";
import { GetByIdUserService } from "../services/getId-user.service.js";
import { UpdateUserService } from "../services/update.user.service.js";


const userRepository = new PrismaUserRepository();


export const MakeCreateUserController = () => {
  const createUserService = new CreateUserService(userRepository);
  const createUserController = new CreateUserController(createUserService);

  return createUserController;
};

export const MakeGetAllUsersController = () => {
  const getAllUsersService = new GetAllUsersService(userRepository);
  const getAllUsersController = new GetUsersController(getAllUsersService);

  return getAllUsersController;
};

export const MakeGetByIdUserController = () => {
  const getByIdUserService = new GetByIdUserService(userRepository);
  const getByIdUserController = new GetByIdUserController(getByIdUserService);

  return getByIdUserController;
};

export const MakeUpdateUserController = () => {
  const updateUserService = new UpdateUserService(userRepository);
  const updateUserController = new UpdateUserController(updateUserService);

  return updateUserController;
};

export const MakeDeleteUserController = () => {
  const deleteUserService = new DeleteUserService(userRepository);
  const deleteUserController = new DeleteUserController(deleteUserService);

  return deleteUserController;
};
