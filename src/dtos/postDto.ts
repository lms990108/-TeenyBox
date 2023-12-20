import { IsNotEmpty, IsString, MaxLength } from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePostDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 게시물의 제목
 *           example: "흥미로운 게시물 제목"
 *           maxLength: 30
 *         content:
 *           type: string
 *           description: 게시물의 내용
 *           example: "게시물의 내용입니다..."
 *       required:
 *         - user_id
 *         - title
 *         - content
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePostDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 게시물의 제목
 *           example: "업데이트된 게시물 제목"
 *           maxLength: 30
 *         content:
 *           type: string
 *           description: 게시물의 내용
 *           example: "게시물의 업데이트된 내용입니다..."
 *       required:
 *         - title
 *         - content
 */

// 게시글 생성을 위한 DTO
export class CreatePostDTO {
  post_number?: number;

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
