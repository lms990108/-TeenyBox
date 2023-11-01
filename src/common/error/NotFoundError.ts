import { StatusCodes } from "http-status-codes";
import CustomError from "./CustomError";

export default class NotFoundError extends CustomError {
  constructor(message: string) {
    super(StatusCodes.NOT_FOUND, message);
  }
}
