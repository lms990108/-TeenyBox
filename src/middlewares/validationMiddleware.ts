import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";

export function validationMiddleware(type: any): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);

    validate(dto).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints!))
          .join(", ");
        res.status(400).json({ message });
      } else {
        req.body = dto;
        next();
      }
    });
  };
}
