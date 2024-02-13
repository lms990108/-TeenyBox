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
    return ReviewModel.findOneAndUpdate(
      { _id: reviewId },
      { ...reviewData, updatedAt: new Date() },
      { new: true },
    );
  }

  async existByUserIdAndShowId(userId: string, showId: string) {
    return ReviewModel.exists({ userId, showId, deletedAt: null });
  }

  async findOne(reviewId: string) {
    return ReviewModel.findOne({
      _id: reviewId,
      deletedAt: null,
    });
  }

  async findReviews(match: object, sort, page?: number, limit?: number) {
    const reviews = await ReviewModel.aggregate([
      { $match: match },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'user_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          title: 1,
          content: 1,
          rate: 1,
          imageUrls: 1,
          userId: 1,
          userNickname: "$user.nickname",
          showId: 1,
          showTitle: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        }
      }
    ]);
    const total = await ReviewModel.countDocuments(match);

    return { reviews, total };
  }

  async findReviewsWithoutPaging(match: object, sort) {
    const reviews = await ReviewModel.aggregate([
      { $match: match },
      { $sort: sort },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: 'user_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          title: 1,
          content: 1,
          rate: 1,
          imageUrls: 1,
          userId: 1,
          userNickname: "$user.nickname",
          showId: 1,
          showTitle: 1,
          createdAt: 1,
          updatedAt: 1,
          deletedAt: 1,
        }
      }
    ]);
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
    return ReviewModel.updateMany(
        { _id: { $in: reviewIds } },
        { $set: { deletedAt: new Date() } }
    );
  }
}

export default new reviewRepository();
