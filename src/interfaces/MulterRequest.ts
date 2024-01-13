import { AuthRequest } from "../middlewares/authUserMiddlewares";

type MulterFile = Express.Multer.File;
export interface MulterRequest extends AuthRequest {
  file: MulterFile;
}
