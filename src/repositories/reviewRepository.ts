import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview, ReviewModel } from "../models/reviewModel";

class reviewRepository {
  async create(
    userId: string,
    postId: number,
    reviewData: CreateReviewDto,
  ): Promise<IReview> {
    const review = new ReviewModel({
      ...reviewData,
    });
    return await review.save();
  }

  async update(reviewId: string, reviewData: UpdateReviewDto) {
    return await ReviewModel.findOneAndUpdate({ _id: reviewId }, reviewData, {
      new: true,
    });
  }

  async findAll(page: number, limit: number) {
    return await ReviewModel.find({ deletedAt: { $ne: null } })
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
    return await ReviewModel.find({ userId, deletedAt: { $ne: null } })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
  }

  async findReviewsByPostId(page: number, limit: number, postId: number) {
    return await ReviewModel.find({ postId, deletedAt: { $ne: null } })
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
