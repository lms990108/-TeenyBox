import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";

export class CreatePromotionDTO {
  @IsOptional()
  promotion_number?: number;

  @IsString({ message: "제목은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "제목은 반드시 입력되어야 합니다." })
  @MaxLength(40, { message: "제목은 40자를 초과할 수 없습니다." })
  title!: string;

  @IsString({ message: "내용은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "내용은 반드시 입력되어야 합니다." })
  content!: string;

  @IsOptional()
  @IsArray({ message: "이미지 URL은 배열이어야 합니다." })
  image_url?: string[];

  @IsOptional()
  tags?: string[] | string;

  @Type(() => Date)
  @IsDate({ message: "시작일은 날짜여야 합니다." })
  @IsNotEmpty({ message: "시작일은 반드시 입력되어야 합니다." })
  start_date!: Date;

  @Type(() => Date)
  @IsDate({ message: "종료일은 날짜여야 합니다." })
  @IsNotEmpty({ message: "종료일은 반드시 입력되어야 합니다." })
  end_date!: Date;

  @IsEnum(
    { 연극: "연극", 기타: "기타" },
    { message: "카테고리는 '연극' 또는 '기타' 여야 합니다." },
  )
  category!: "연극" | "기타";

  @IsOptional()
  @IsString({ message: "연극제목은 문자열이어야 합니다." })
  play_title?: string;

  @IsOptional()
  @IsInt({ message: "런타임은 정수형이어야 합니다." })
  runtime?: number;

  @IsOptional()
  @IsString({ message: "장소는 문자열이어야 합니다." })
  location?: string;

  @IsOptional()
  @IsString({ message: "주최는 문자열이어야 합니다." })
  host?: string;
}

export class UpdatePromotionDTO {
  @IsOptional()
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @MaxLength(40, { message: "제목은 40자를 초과할 수 없습니다." })
  title?: string;

  @IsOptional()
  @IsString({ message: "내용은 문자열이어야 합니다." })
  content?: string;

  @IsOptional()
  @IsArray({ message: "이미지 URL은 배열이어야 합니다." })
  image_url?: string[];

  @IsOptional()
  tags?: string[] | string;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: "시작일은 날짜여야 합니다." })
  start_date?: Date;

  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: "종료일은 날짜여야 합니다." })
  end_date?: Date;

  @IsOptional()
  @IsEnum(
    { 연극: "연극", 기타: "기타" },
    { message: "유효한 카테고리를 입력해야 합니다." },
  )
  category?: "연극" | "기타";

  @IsOptional()
  @IsString({ message: "연극제목은 문자열이어야 합니다." })
  play_title?: string;

  @IsOptional()
  @IsInt({ message: "런타임은 정수형이어야 합니다." })
  runtime?: number;

  @IsOptional()
  @IsString({ message: "장소는 문자열이어야 합니다." })
  location?: string;

  @IsOptional()
  @IsString({ message: "주최는 문자열이어야 합니다." })
  host?: string;
}
