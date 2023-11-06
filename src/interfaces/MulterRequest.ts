import { Request } from "express";
import multer from "multer";

export interface MulterRequest extends Request {
  file: multer.File;
}
