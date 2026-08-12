import { CreateMoodController } from "../controllers/create-mood.controller.js";
import { GetAllMoodsController } from "../controllers/getAll-mood.controller.js";
import { GetByIdMoodController } from "../controllers/getById-mood.controller.js";
import { PrismaMoodRepository } from "../repository/prisma.repository.js";
import { CreateMoodService } from "../services/create-mood.service.js";
import { GetAllMoodsService } from "../services/getAll-mood.service.js";
import { GetMoodByIdService } from "../services/getById-mood.service.js";

const moodRepository = new PrismaMoodRepository();

export const MakeCreateMoodController = () => {
  const createMoodService = new CreateMoodService(moodRepository);
  const createMoodController = new CreateMoodController(createMoodService);

  return createMoodController;
};

export const MakeGetAllMoodsController = () => {
  const getAllMoodsService = new GetAllMoodsService(moodRepository);
  const getAllMoodsController = new GetAllMoodsController(getAllMoodsService);

  return getAllMoodsController;
};

export const MakeGetMoodByIdController = () => {
  const getMoodByIdService = new GetMoodByIdService(moodRepository);
  const getMoodByIdController = new GetByIdMoodController(getMoodByIdService);
  return getMoodByIdController;
};
