import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

export default class MethodNotAllowedError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.METHOD_NOT_ALLOWED, message);
  }
}
