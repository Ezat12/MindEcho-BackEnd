import multer from "multer";
import { AppError } from "shared/errors/app-error.js";

const storage = multer.memoryStorage();

const limits = { fileSize: 50 * 1024 * 1024 };

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
];

const upload = multer({
  storage,
  limits,
  fileFilter(req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Invalid file type", 400));
      return;
    }
  },
});

export default upload;
