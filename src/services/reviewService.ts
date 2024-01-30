import BadRequestError from "../common/error/BadRequestError";
import ForbiddenError from "../common/error/ForbiddenError";
import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";
import { IUser } from "../models/userModel";
import reviewRepository from "../repositories/reviewRepository";
import showService from "./showService";
import userService from "./userService";
import { ROLE } from "../common/enum/enum";
import { uploadImageToS3 } from "../common/utils/awsS3Utils";
import NotFoundError from "../common/error/NotFoundError";
import { IShow } from "../models/showModel";

class reviewService {
  async create(
    userId: string,
    showId: string,
    reviewData: CreateReviewDto,
    detailImages: Express.Multer.File[],
  ): Promise<IReview> {
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
    user.review.push(createdReview._id);
    show.reviews.push(createdReview._id);
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

    if (userId !== review.userId)
      throw new ForbiddenError("리뷰 수정은 작성자만 가능합니다.");

    const imagePromises = detailImages.map((image) =>
      uploadImageToS3(image, `reviews/${Date.now()}_${image.originalname}`),
    );

    const imageUrls = await Promise.all(imagePromises);

    return await reviewRepository.update(reviewId, reviewData, imageUrls);
  }

  async findAll(page: number = 0, limit: number = 20) {
    return await reviewRepository.findAll(page, limit);
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
    const review = await this.findOne(reviewId);

    if (user.user_id !== review.userId && user.role !== ROLE.ADMIN)
      throw new ForbiddenError("리뷰 삭제는 작성자 또는 관리자만 가능합니다.");

    return await reviewRepository.deleteOne(reviewId);
  }

  async deleteMany(reviewIds: string[]) {
    return await reviewRepository.deleteMany(reviewIds);
  }
}

export default new reviewService();
