import ForbiddenError from "../common/error/ForbiddenError";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";
import { IUser } from "../models/userModel";
import reviewRepository from "../repositories/reviewRepository";
import showService from "./showService";
import userService from "./userService";
import { deleteImagesFromS3 } from "../common/utils/awsS3Utils";
import NotFoundError from "../common/error/NotFoundError";
import { IShow } from "../models/showModel";
import ConflictError from "../common/error/ConflictError";
import { Schema } from "mongoose";
import { ROLE } from "../common/enum/enum";

class reviewService {
  async create(
    userId: string,
    showId: string,
    reviewData: CreateReviewDto,
  ): Promise<IReview> {
    if (await reviewRepository.existByUserIdAndShowId(userId, showId))
      throw new ConflictError("이미 리뷰를 작성한 공연입니다.");

    const user = await userService.getUserById(userId);
    const show = await showService.findShowByShowId(showId);

    const userNickname = user.nickname;
    const showTitle = show.title;

    const { imageUrlsToDelete } = reviewData;
    if (imageUrlsToDelete) await deleteImagesFromS3(imageUrlsToDelete);

    const review = {
      ...reviewData,
      userNickname,
      showTitle,
    };

    const createdReview = await reviewRepository.create(userId, showId, review);

    await this.updateShowAndUser(show, user, createdReview);

    return createdReview;
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

  async update(userId: string, reviewId: string, reviewData: UpdateReviewDto) {
    const review = await this.findOne(reviewId);
    const originalRating = review.rate;

    if (userId !== review.userId)
      throw new ForbiddenError("리뷰 수정은 작성자만 가능합니다.");

    const { imageUrlsToDelete } = reviewData;
    if (imageUrlsToDelete) await deleteImagesFromS3(imageUrlsToDelete);

    const updatedReview = await reviewRepository.update(reviewId, reviewData);
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
    return review;
  }

  async findReviews(match: object, sort, page?: number, limit?: number) {
    const { reviews, total } =
      limit && page
        ? await reviewRepository.findReviews(match, sort, page, limit)
        : await reviewRepository.findReviewsWithoutPaging(match, sort);

    if (!reviews) {
      throw new NotFoundError(`검색 결과: 해당하는 리뷰를 찾을 수 없습니다.`);
    }

    return { reviews, total };
  }

  async deleteOne(user: IUser, reviewId: string) {
    const review = await this.findOne(reviewId);

    if (user.user_id !== review.userId && user.role !== ROLE.ADMIN)
      throw new ForbiddenError("리뷰 삭제는 작성자 또는 관리자만 가능합니다.");

    const showId = review.showId;
    const show = await showService.findShowByShowId(showId);

    /**
     * 공연 평점 업데이트
     */
    const { totalRating, notExcludedReviewIds } =
      await this.calculateTotalRating(show.reviews, reviewId);

    /**
     * S3에 있는 이미지 삭제
     */
    await deleteImagesFromS3(review.imageUrls);

    await reviewRepository.deleteOne(reviewId);
    await this.updateRating(show, totalRating, notExcludedReviewIds);
  }

  async deleteMany(user: IUser, reviewIds: string[]) {
    for (const reviewId of reviewIds) {
      const review = await this.findOne(reviewId);
      if (user.user_id !== review.userId && user.role !== ROLE.ADMIN)
        throw new ForbiddenError(
          "리뷰 삭제는 작성자 또는 관리자만 가능합니다.",
        );

      const showId = review.showId;
      const show = await showService.findShowByShowId(showId);

      const { totalRating, notExcludedReviewIds } =
        await this.calculateTotalRating(show.reviews, reviewId);

      await deleteImagesFromS3(review.imageUrls);

      await reviewRepository.deleteOne(reviewId);
      await this.updateRating(show, totalRating, notExcludedReviewIds);
    }
  }

  private async calculateTotalRating(
    reviewIds: Schema.Types.ObjectId[],
    excludedReviewId: string,
  ) {
    const notExcludedReviewIds = [];
    let totalRating = 0;

    for (const rId of reviewIds) {
      const reviewIdStr = rId.toString();
      if (reviewIdStr !== excludedReviewId) {
        const r = await this.findOne(reviewIdStr.toString());
        totalRating += r.rate;
        notExcludedReviewIds.push(rId);
      }
    }

    return { totalRating, notExcludedReviewIds };
  }

  private async updateRating(
    show: IShow,
    totalRating: number,
    notExcludedReviews: Schema.Types.ObjectId[],
  ) {
    const length = notExcludedReviews.length;

    show.reviews = notExcludedReviews;
    show.avg_rating = length > 0 ? totalRating / length : 0;

    await show.save();
  }
}

export default new reviewService();
