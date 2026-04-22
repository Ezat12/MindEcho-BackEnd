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

const userRoutes = Router();

const createUserController = MakeCreateUserController();
const getAllUsersController = MakeGetAllUsersController();
const getByIdUserController = MakeGetByIdUserController();
const updateUserController = MakeUpdateUserController();
const deleteUserController = MakeDeleteUserController();

userRoutes
  .route("/")
  .post(validate(createUserSchema), createUserController.handle)
  .get(getAllUsersController.handle);

userRoutes
  .route("/:id")
  .get(validate(IdParamSchema, "params"), getByIdUserController.handle)
  .patch(
    validate(IdParamSchema, "params"),
    validate(UpdateUserSchema),
    updateUserController.handle,
  )
  .delete(validate(IdParamSchema, "params"), deleteUserController.handle);

export { userRoutes };
