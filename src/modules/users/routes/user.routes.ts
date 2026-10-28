import { Router } from "express";
import {
  MakeCreateUserController,
  MakeDeleteUserController,
  MakeGetAllUsersController,
  MakeGetByIdUserController,
  MakeUpdateUserController,
} from "../design/factory-users-routes.js";
import { validate } from "../../../middlewares/validate-zod.js";
import { createUserSchema } from "../dto/create-user.dto.js";
import { IdParamSchema } from "../dto/id-params.schema.js";
import { UpdateUserSchema } from "../dto/update-user.dto.js";
import { protectAuth } from "middlewares/protectAuth.js";
import { PrismaAuthRepository } from "modules/auth/repository/prisma-repository.js";
import { allowedTo } from "middlewares/allowedTo.js";

const userRoutes = Router();

const createUserController = MakeCreateUserController();
const getAllUsersController = MakeGetAllUsersController();
const getByIdUserController = MakeGetByIdUserController();
const updateUserController = MakeUpdateUserController();
const deleteUserController = MakeDeleteUserController();

const authRepository = new PrismaAuthRepository();

userRoutes
  .route("/")

  .post(
    validate(createUserSchema, "body"),
    protectAuth(authRepository),
    allowedTo(["ADMIN"]),
    createUserController.handle,
  )
  .get(
    protectAuth(authRepository),
    allowedTo(["ADMIN"]),
    getAllUsersController.handle,
  );

userRoutes
  .route("/:id")
  .get(
    validate(IdParamSchema, "params"),
    protectAuth(authRepository),
    getByIdUserController.handle,
  )
  .patch(
    validate(IdParamSchema, "params"),
    validate(UpdateUserSchema, "body"),
    protectAuth(authRepository),
    allowedTo(["ADMIN"]),
    updateUserController.handle,
  )
  .delete(
    protectAuth(authRepository),
    allowedTo(["ADMIN"]),
    validate(IdParamSchema, "params"),
    deleteUserController.handle,
  );

export { userRoutes };
