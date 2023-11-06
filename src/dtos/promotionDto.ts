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

  @IsString({ message: "포스터 이미지 경로는 문자열이어야 합니다." })
  @IsNotEmpty({ message: "포스터 이미지 경로는 반드시 입력되어야 합니다." })
  poster_image!: string; // 이 필드는 업로드된 이미지의 경로 또는 URL을 담게 됩니다.
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

  @IsString({ message: "포스터 이미지 경로는 문자열이어야 합니다." })
  poster_image?: string; // 수정 시 포스터 이미지는 선택적일 수 있으므로 optional로 만듭니다.
}

// ... 나머지 DTO들도 필요에 따라 추가적으로 정의
