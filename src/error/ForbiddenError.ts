import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

export default class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.FORBIDDEN, message);
  }
}