import { IReview } from "../models/reviewModel";
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateReviewDto {
  @IsString()
  @Length(1, 30, { message: "리뷰 제목은 1~30자 사이여야 합니다." })
  @IsNotEmpty({ message: "제목을 입력해주세요" })
  title: string;

  @IsString()
  @Length(1, 500, { message: "리뷰 내용은 1~500자 사이여야 합니다." })
  @IsNotEmpty({ message: "내용을 입력해주세요" })
  content: string;

  @IsNumber()
  @IsIn([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], {
    message: "Invalid Rate",
  })
  @IsNotEmpty({ message: "평점을 입력해주세요" })
  rate: number;

  @IsArray()
  imageUrls?: string[];

  @IsArray()
  imageUrlsToDelete?: string[];
}

export class UpdateReviewDto {
  @IsString()
  @Length(1, 30, { message: "리뷰 제목은 1~30자 사이여야 합니다." })
  title: string;

  @IsString()
  @Length(1, 500, { message: "리뷰 내용은 1~500자 사이여야 합니다." })
  content: string;

  @IsNumber()
  @IsIn([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5], {
    message: "Invalid Rate",
  })
  rate: number;

  @IsArray()
  imageUrls?: string[];

  @IsArray()
  imageUrlsToDelete?: string[];
}

export class ReviewResponseDto {
  _id: string;
  user_nickname: string;
  show_title: string;
  show_id: string;
  user_id: string;
  title: string;
  content: string;
  rate: number;
  image_urls: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  constructor(review: IReview) {
    this._id = review._id;
    this.user_nickname = review.userNickname;
    this.show_title = review.showTitle;
    this.show_id = review.showId;
    this.user_id = review.userId;
    this.title = review.title;
    this.content = review.content;
    this.rate = review.rate;
    this.image_urls = review.imageUrls;
    this.created_at = review.createdAt;
    this.updated_at = review.updatedAt;
    this.deleted_at = review.deletedAt;
  }
}
