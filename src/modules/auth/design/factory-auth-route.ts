import { LoginController } from "../controllers/login.controller.js";
import { RegisterController } from "../controllers/register.controller.js";
import { TokenJWT } from "../provider/toke-jwt.js";
import { PrismaAuthRepository } from "../repository/prisma-repository.js";
import { LoginService } from "../services/login.service.js";
import { RegisterService } from "../services/register.service.js";

const authRepository = new PrismaAuthRepository();
const tokenProvider = new TokenJWT();

export const MakeRegisterController = () => {
  const registerService = new RegisterService(authRepository, tokenProvider);
  const registerController = new RegisterController(registerService);
  return registerController;
};

export const MakeLoginController = () => {
  const loginService = new LoginService(authRepository, tokenProvider);
  const loginController = new LoginController(loginService);
  return loginController;
};
