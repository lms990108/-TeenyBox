import { IsNotEmpty, IsString, MaxLength } from "class-validator";

// 게시글 생성을 위한 DTO

export class CreatePromotionDTO {
  promotion_number?: number;

  @IsString({ message: "user_id는 문자열이어야 합니다." })
  @IsNotEmpty({ message: "user_id는 반드시 입력되어야 합니다." })
  user_id!: string;

  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(30, { message: "제목은 30자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsString({ message: "포스터 사진 url은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "포스터 사진은 반드시 입력되어야 합니다." })
  poster_url!: string;
}

// 게시글 수정을 위한 DTO
export class UpdatePromotionDTO {
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(30, { message: "제목은 30자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsString({ message: "포스터 사진 url은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "포스터 사진은 반드시 입력되어야 합니다." })
  poster_url!: string;
}
// ... 나머지 DTO들도 필요에 따라 추가적으로 정의
