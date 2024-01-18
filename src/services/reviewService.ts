import BadRequestError from "../common/error/BadRequestError";
import ForbiddenError from "../common/error/ForbiddenError";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";
import { IUser } from "../models/userModel";
import reviewRepository from "../repositories/reviewRepository";
import showService from "./showService";
import userService from "./userService";
import { ROLE } from "../common/enum/enum";

class reviewService {
  async create(
    userId: string,
    showId: string,
    reviewData: CreateReviewDto,
  ): Promise<IReview> {
    const user = await userService.getUserById(userId);
    const show = await showService.findShowByShowId(showId);
    const review = await reviewRepository.create(userId, showId, reviewData);

    user.review.push(review._id);
    show.reviews.push(review._id);

    await user.save();
    await show.save();

    return review;
  }

  async update(userId: string, reviewId: string, reviewData: UpdateReviewDto) {
    const review = await reviewRepository.findOne(reviewId);

    if (review.deletedAt != null)
      throw new BadRequestError("이미 삭제된 리뷰입니다.");
    if (userId !== review.userId)
      throw new ForbiddenError("리뷰 수정은 작성자만 가능합니다.");

    return await reviewRepository.update(reviewId, reviewData);
  }

  async findAll(page: number = 0, limit: number = 20) {
    return await reviewRepository.findAll(page, limit);
  }

  async findOne(reviewId: string): Promise<IReview> {
    const review = await reviewRepository.findOne(reviewId);
    if (review.deletedAt != null)
      throw new BadRequestError("이미 삭제된 리뷰입니다.");
    return review;
  }

  async findReviewsByUserId(
    page: number = 0,
    limit: number = 20,
    userId: string,
  ) {
    await userService.getUserById(userId);
    return await reviewRepository.findReviewsByUserId(page, limit, userId);
  }

  async findReviewsByShowId(
    page: number = 0,
    limit: number = 20,
    showId: string,
  ) {
    await showService.findShowByShowId(showId);
    return await reviewRepository.findReviewsByShowId(page, limit, showId);
  }

  async findReviewsByUserIdAndShowId(
    page: number = 0,
    limit: number = 20,
    userId: string,
    showId: string,
  ) {
    await userService.getUserById(userId);
    await showService.findShowByShowId(showId);

    return await reviewRepository.findReviewsByUserIdAndShowId(
      page,
      limit,
      userId,
      showId,
    );
  }

  async deleteOne(user: IUser, reviewId: string) {
    const review = await reviewRepository.findOne(reviewId);

    if (review.deletedAt != null)
      throw new BadRequestError("이미 삭제된 리뷰입니다.");
    if (user.user_id !== review.userId && user.role !== ROLE.ADMIN)
      throw new ForbiddenError("리뷰 삭제는 작성자 또는 관리자만 가능합니다.");

    return await reviewRepository.deleteOne(reviewId);
  }
}

export default new reviewService();
