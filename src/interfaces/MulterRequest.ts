import { AuthRequest } from "../middlewares/authUserMiddlewares";
import multer from "multer";

export interface MulterRequest extends AuthRequest {
  file: multer.File;
}
