import CustomError from "./CustomError";
import { StatusCodes } from "http-status-codes";

export default class ConflictError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.CONFLICT, message);
  }
}
