import { IsNotEmpty, IsString, MaxLength } from "class-validator";

// 게시글 생성을 위한 DTO
export class CreatePostDTO {
  post_number?: number;

  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(30, { message: "제목은 30자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;
}

// 게시글 수정을 위한 DTO
export class UpdatePostDTO {
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(30, { message: "제목은 30자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;
}
