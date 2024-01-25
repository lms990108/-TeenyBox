import { IReview } from "../models/reviewModel";

export class CreateReviewDto {
  title: string;
  content: string;
  rate: number;
}

export class UpdateReviewDto {
  title: string;
  content: string;
  rate: number;
}

export class ReviewResponseDto {
  _id: string;
  user_id: string;
  show_id: string;
  title: string;
  content: string;
  rate: number;
  image_urls: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  constructor(review: IReview) {
    this._id = review._id;
    this.user_id = review.userId;
    this.show_id = review.showId;
    this.title = review.title;
    this.content = review.content;
    this.rate = review.rate;
    this.image_urls = review.imageUrls;
    this.created_at = review.createdAt;
    this.updated_at = review.updatedAt;
    this.deleted_at = review.deletedAt;
  }
}
