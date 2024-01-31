import BadRequestError from "../common/error/BadRequestError";
import ForbiddenError from "../common/error/ForbiddenError";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";
import { IUser } from "../models/userModel";
import reviewRepository from "../repositories/reviewRepository";
import showService from "./showService";
import userService from "./userService";
import { uploadImageToS3 } from "../common/utils/awsS3Utils";
import NotFoundError from "../common/error/NotFoundError";
import { IShow } from "../models/showModel";
import ConflictError from "../common/error/ConflictError";

class reviewService {
  async create(
    userId: string,
    showId: string,
    reviewData: CreateReviewDto,
    detailImages: Express.Multer.File[],
  ): Promise<IReview> {
    if (await reviewRepository.existByUserIdAndShowId(userId, showId))
      throw new ConflictError("이미 리뷰를 작성한 공연입니다.");

    const user = await userService.getUserById(userId);
    const show = await showService.findShowByShowId(showId);

    const userNickname = user.nickname;
    const showTitle = show.title;

    const review = {
      ...reviewData,
      userNickname,
      showTitle,
      detailImages: null,
    };

    const imageUrls = await this.uploadImages(detailImages);
    const createdReview = await reviewRepository.create(
      userId,
      showId,
      review,
      imageUrls,
    );

    await this.updateShowAndUser(show, user, createdReview);

    return createdReview;
  }

  private async uploadImages(detailImages: Express.Multer.File[]) {
    const imagePromises = detailImages.map((image) =>
      uploadImageToS3(image, `reviews/${Date.now()}_${image.originalname}`),
    );
    return Promise.all(imagePromises);
  }

  private async updateShowAndUser(
    show: IShow,
    user: IUser,
    createdReview: IReview,
  ) {
    const rating = show.avg_rating;
    const length = show.reviews.length;
    const total = rating * length;
    const newRate = createdReview.rate;

    user.review.push(createdReview._id);
    show.reviews.push(createdReview._id);

    // 소수점 2자리
    const avgRating = (total + newRate) / (length + 1);
    const formattedRating = avgRating.toFixed(2);
    show.avg_rating = parseFloat(formattedRating);

    await user.save();
    await show.save();
  }

  async update(
    userId: string,
    reviewId: string,
    reviewData: UpdateReviewDto,
    detailImages: Express.Multer.File[],
  ) {
    const review = await this.findOne(reviewId);
    const originalRating = review.rate;

    if (userId !== review.userId)
      throw new ForbiddenError("리뷰 수정은 작성자만 가능합니다.");

    const imagePromises = detailImages.map((image) =>
      uploadImageToS3(image, `reviews/${Date.now()}_${image.originalname}`),
    );
    const imageUrls = await Promise.all(imagePromises);

    const updatedReview = await reviewRepository.update(
      reviewId,
      reviewData,
      imageUrls,
    );
    const updatedRating = updatedReview.rate;

    if (originalRating !== updatedRating) {
      const show = await showService.findShowByShowId(updatedReview.showId);
      await this.updateShowAvgRating(originalRating, updatedRating, show);
    }

    return updatedReview;
  }

  private async updateShowAvgRating(
    originalRating: number,
    updatedRating: number,
    show: IShow,
  ) {
    const rating = show.avg_rating;
    const length = show.reviews.length;
    const originalTotal = rating * length;
    const newTotal = originalTotal - originalRating + updatedRating;

    const avgRating = newTotal / length;
    const formattedRating = avgRating.toFixed(2);
    show.avg_rating = parseFloat(formattedRating);

    await show.save();
  }

  async findOne(reviewId: string): Promise<IReview> {
    const review = await reviewRepository.findOne(reviewId);
    if (!review) {
      throw new NotFoundError("존재하지 않는 리뷰입니다.");
    }
    if (review.deletedAt != null)
      throw new BadRequestError("이미 삭제된 리뷰입니다.");
    return review;
  }

  async findReviews(match: object, page?: number, limit?: number) {
    let reviews, total;

    if (page !== undefined && limit !== undefined) {
      const result = await reviewRepository.findReviews(match, page, limit);
      reviews = result.reviews;
      total = result.total;
    } else {
      const result = await reviewRepository.findReviewsWithoutPaging(match);
      reviews = result.reviews;
      total = result.total;
    }

    if (!reviews) {
      throw new NotFoundError(`검색 결과: 해당하는 리뷰를 찾을 수 없습니다.`);
    }

    return { reviews, total };
  }

  async deleteOne(user: IUser, reviewId: string) {
    const review = await this.findOne(reviewId);

    if (user.user_id !== review.userId)
      throw new ForbiddenError("리뷰 삭제는 작성자만 가능합니다.");

    return await reviewRepository.deleteOne(reviewId);
  }

  async deleteMany(user: IUser, reviewIds: string[]) {
    for (const reviewId of reviewIds) {
      const review = await this.findOne(reviewId);
      if (user.user_id !== review.userId)
        throw new ForbiddenError("리뷰 삭제는 작성자만 가능합니다.");
    }

    return await reviewRepository.deleteMany(reviewIds);
  }
}

export default new reviewService();
