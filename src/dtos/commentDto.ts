import { IsNotEmpty, IsString, IsOptional, IsMongoId } from "class-validator";

// 댓글 생성을 위한 DTO
export class CreateCommentDTO {
  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsOptional()
  @IsMongoId({ message: "post는 유효한 MongoDB ID여야 합니다." })
  post?: string;

  @IsOptional()
  @IsMongoId({ message: "promotion은 유효한 MongoDB ID여야 합니다." })
  promotion?: string;
}

// 댓글 수정을 위한 DTO
export class UpdateCommentDTO {
  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;
}
