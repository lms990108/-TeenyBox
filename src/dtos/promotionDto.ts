import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
} from "class-validator";

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePromotionDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 프로모션 게시물의 제목
 *           example: "흥미로운 프로모션 제목"
 *           maxLength: 30
 *         content:
 *           type: string
 *           description: 프로모션 게시물의 내용
 *           example: "프로모션 내용입니다..."
 *         poster_image:
 *           type: string
 *           description: 프로모션 포스터 이미지 경로
 *           example: "/path/to/image.jpg"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 프로모션에 관련된 태그들
 *           example: ["세일", "이벤트", "할인"]
 *       required:
 *         - title
 *         - content
 *         - poster_image
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdatePromotionDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: 프로모션 게시물의 제목
 *           example: "업데이트된 프로모션 제목"
 *           maxLength: 30
 *         content:
 *           type: string
 *           description: 프로모션 게시물의 내용
 *           example: "업데이트된 프로모션 내용입니다..."
 *         poster_image:
 *           type: string
 *           description: 프로모션 포스터 이미지 경로 (수정 시 변경 가능)
 *           example: "/path/to/updated_image.jpg"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 프로모션에 관련된 태그들 (수정 시 변경 가능)
 *           example: ["업데이트", "새로운 이벤트"]
 *       required:
 *         - title
 *         - content
 */

// 게시글 생성을 위한 DTO
export class CreatePromotionDTO {
  promotion_number?: number;

  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(30, { message: "제목은 30자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsOptional()
  @IsArray({ message: "tags는 배열이어야 합니다." })
  tags?: string[];

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

  @IsOptional()
  @IsArray({ message: "tags는 배열이어야 합니다." })
  tags?: string[];
}
