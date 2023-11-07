import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Response, NextFunction, RequestHandler } from "express";
import { MulterRequest } from "../interfaces/MulterRequest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validationMiddleware(type: any): RequestHandler {
  return (req: MulterRequest, res: Response, next: NextFunction) => {
    if (req.file) {
      req.body.poster_image = req.file.path; // 로컬 파일 시스템 경로를 사용합니다.
    }

    const dto = plainToInstance(type, req.body);

    validate(dto).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorResponses = errors.map((error) => {
          let errorCode;
          let errorMessage;

          switch (error.property) {
            case "user_id":
              errorCode = 422;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "social_provider":
              errorCode = 423;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "nickname":
              errorCode = 424;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "profile_url":
              errorCode = 425;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "interested_area":
              errorCode = 426;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "title":
              errorCode = 423;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "content":
              errorCode = 424;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            case "poster_image":
              errorCode = 425;
              errorMessage = Object.values(error.constraints!).join(", ");
              break;
            default:
              errorCode = 400; // 기본값: Bad Request
              errorMessage = Object.values(error.constraints!).join(", ");
          }

          return {
            field: error.property,
            code: errorCode,
            message: errorMessage,
          };
        });

        // 가장 처음 발생한 에러의 상태 코드를 반환합니다.
        // 또는 여러 에러를 한번에 반환하려면 상태 코드를 조정해야 합니다.
        res.status(errorResponses[0].code).json({
          errors: errorResponses,
        });
      } else {
        req.body = dto;
        next();
      }
    });
  };
}
