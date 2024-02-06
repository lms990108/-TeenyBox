import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsArray,
  IsDate,
} from "class-validator";
import { Type } from "class-transformer";

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
}

export class UpdatePromotionDTO {
  @IsOptional()
  @IsString({ message: "제목은 문자열이어야 합니다." })
  @MaxLength(30, { message: "제목은 30자를 초과할 수 없습니다." })
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
}
