import type { User } from "../../modules/users/domain/user.js";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export {};
