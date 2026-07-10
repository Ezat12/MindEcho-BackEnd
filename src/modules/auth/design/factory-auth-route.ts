import { GetProfileController } from "../controllers/get-profile.controller.js";
import { LoginController } from "../controllers/login.controller.js";
import { LogoutController } from "../controllers/logout.controller.js";
import { RefreshTokenController } from "../controllers/refresh-token.controller.js";
import { RegisterController } from "../controllers/register.controller.js";
import { TokenJWT } from "../provider/token-jwt.js";
import { PrismaAuthRepository } from "../repository/prisma-repository.js";
import { LoginService } from "../services/login.service.js";
import { LogoutService } from "../services/logout.service.js";
import { RefreshTokenService } from "../services/refresh-token.service.js";
import { RegisterService } from "../services/register.service.js";

export const authRepository = new PrismaAuthRepository();
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

export const MakeRefreshTokenController = () => {
  const refreshTokenService = new RefreshTokenService(tokenProvider);
  const refreshTokenController = new RefreshTokenController(
    refreshTokenService,
  );
  return refreshTokenController;
};

export const MakeLogoutController = () => {
  const logoutService = new LogoutService();
  const logoutController = new LogoutController(logoutService);
  return logoutController;
};

export const MakeProfileController = () => {
  const profileController = new GetProfileController();
  return profileController;
};
