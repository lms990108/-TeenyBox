import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

export default class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}
