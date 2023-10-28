import { IsNotEmpty, IsString, IsInt, MaxLength } from "class-validator";

// 게시글 생성을 위한 DTO

export class CreatePostDTO {
  post_number?: number;

  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}

// 게시글 수정을 위한 DTO
export class UpdatePostDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;
}
// ... 나머지 DTO들도 필요에 따라 추가적으로 정의
