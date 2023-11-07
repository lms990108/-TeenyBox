import { AuthRequest } from "../middlewares/authUserMiddlewares";
import { MulterRequest } from "./MulterRequest";

export interface AuthMulterRequest extends MulterRequest, AuthRequest {}
