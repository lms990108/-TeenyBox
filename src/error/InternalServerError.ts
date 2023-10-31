import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

export default class InternalServerError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}
