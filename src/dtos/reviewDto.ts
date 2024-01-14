import { IReview } from "../models/reviewModel";

export class CreateReviewDto {
  content: string;
  rate: number;
}

export class UpdateReviewDto {
  content: string;
  rate: number;
}

export class ReviewResponseDto {
  _id: string;
  user_id: string;
  show_id: string;
  content: string;
  rate: number;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;

  constructor(review: IReview) {
    this._id = review._id;
    this.user_id = review.userId;
    this.show_id = review.showId;
    this.content = review.content;
    this.rate = review.rate;
    this.created_at = review.createdAt;
    this.updated_at = review.updatedAt;
    this.deleted_at = review.deletedAt;
  }
}
