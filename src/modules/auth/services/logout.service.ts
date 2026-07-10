import { redisClient } from "config/redis.js";

export class LogoutService {
  async execute(userId: string): Promise<void> {
    await redisClient.del(`refresh:${userId}`);
  }
}
