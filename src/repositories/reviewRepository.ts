import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview, ReviewModel } from "../models/reviewModel";

class reviewRepository {
  async create(
    userId: string,
    showId: string,
    reviewData: CreateReviewDto,
  ): Promise<IReview> {
    const review = new ReviewModel({
      userId,
      showId,
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await review.save();
  }

  async update(reviewId: string, reviewData: UpdateReviewDto) {
    return await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { ...reviewData, updatedAt: new Date() },
      {
        new: true,
      },
    );
  }

  async findAll(page: number, limit: number) {
    return await ReviewModel.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
  }

  async findOne(reviewId: string) {
    return await ReviewModel.findOne({
      _id: reviewId,
    });
  }

  async findReviewsByUserId(page: number, limit: number, userId: string) {
    return await ReviewModel.find({ userId, deletedAt: null })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
  }

  async findReviewsByShowId(page: number, limit: number, showId: string) {
    return await ReviewModel.find({ showId, deletedAt: null })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
  }

  async deleteOne(reviewId: string) {
    return await ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { deletedAt: new Date() },
      { new: true },
    );
  }
}

export default new reviewRepository();
