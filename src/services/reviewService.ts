import BadRequestError from "../common/error/BadRequestError";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";
import reviewRepository from "../repositories/reviewRepository";
import userService from "./userService";

class reviewService {
  async create(userId: string, postId: number, reviewData: CreateReviewDto) {
    const user = await userService.getUserById(userId);
  }

  async update(reviewId: string, reviewData: UpdateReviewDto) {
    return await reviewRepository.update(reviewId, reviewData);
  }

  async findAll(page: number, limit: number) {
    return await reviewRepository.findAll(page, limit);
  }

  async findOne(reviewId: string): Promise<IReview> {
    const review = await reviewRepository.findOne(reviewId);
    if (review.deletedAt != null)
      throw new BadRequestError("삭제된 리뷰입니다.");
    return review;
  }

  async findReviewsByUserId(page: number, limit: number, userId: string) {
    return await reviewRepository.findReviewsByUserId(page, limit, userId);
  }

  async findReviewsByPostId(page: number, limit: number, postId: number) {
    return await reviewRepository.findReviewsByPostId(page, limit, postId);
  }

  async deleteOne(reviewId: string) {
    const review = await reviewRepository.findOne(reviewId);
    if (review.deletedAt != null)
      throw new BadRequestError("이미 삭제된 리뷰입니다.");
    return await reviewRepository.deleteOne(reviewId);
  }
}

export default new reviewService();
