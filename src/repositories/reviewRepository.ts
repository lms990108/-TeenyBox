import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview, ReviewModel } from "../models/reviewModel";
import { ShowModel } from "../models/showModel";

class reviewRepository {
  async create(
    userId: string,
    showId: string,
    reviewData: CreateReviewDto,
    imageUrls: string[],
  ): Promise<IReview> {
    const review = new ReviewModel({
      userId,
      showId,
      ...reviewData,
      imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await review.save();
  }

  async update(
    reviewId: string,
    reviewData: UpdateReviewDto,
    imageUrls: string[],
  ) {
    return ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { ...reviewData, updatedAt: new Date(), imageUrls },
      {
        new: true,
      },
    );
  }

  async existByUserIdAndShowId(userId: string, showId: string) {
    return ReviewModel.exists({ userId, showId });
  }

  async findOne(reviewId: string) {
    return ReviewModel.findOne({
      _id: reviewId,
    });
  }

  async findReviews(match: object, page?: number, limit?: number) {
    const reviews = await ReviewModel.aggregate([
      { $match: match },
      { $sort: { created_at: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    const total = await ReviewModel.countDocuments(match);

    return { reviews, total };
  }

  async findReviewsWithoutPaging(match: object) {
    const reviews = await ReviewModel.aggregate([{ $match: match }]);
    const total = await ReviewModel.countDocuments(match);

    return { reviews, total };
  }

  async deleteOne(reviewId: string) {
    return ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { deletedAt: new Date() },
      { new: true },
    );
  }

  async deleteMany(reviewIds: string[]) {
    const updateQuery = {
      $set: {
        deletedAt: new Date(),
      },
    };

    return ReviewModel.updateMany({ _id: { $in: reviewIds } }, updateQuery);
  }
}

export default new reviewRepository();
