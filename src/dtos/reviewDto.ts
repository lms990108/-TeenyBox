import { IReview } from "../models/reviewModel";
import { IsIn, IsInt, IsString, Length } from "class-validator";

export class CreateReviewDto {
  @IsString()
  @Length(1, 30, { message: "리뷰 제목은 1~30자 사이어야 합니다." })
  title: string;

  @IsString()
  content: string;

  @IsInt()
  @IsIn([1, 2, 3, 4, 5], { message: "평점은 1부터 5까지만 가능합니다." })
  rate: number;
}

export class UpdateReviewDto {
  @IsString()
  @Length(1, 30, { message: "리뷰 제목은 1~30자 사이어야 합니다." })
  title: string;

  @IsString()
  content: string;

  @IsInt()
  @IsIn([1, 2, 3, 4, 5], { message: "평점은 1부터 5까지만 가능합니다." })
  rate: number;
}

export class ReviewResponseDto {
  _id: string;
  user_nickname: string;
  show_title: string;
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
    this.title = review.title;
    this.content = review.content;
    this.rate = review.rate;
    this.image_urls = review.imageUrls;
    this.created_at = review.createdAt;
    this.updated_at = review.updatedAt;
    this.deleted_at = review.deletedAt;
  }
}
