import { CreateReviewDto, UpdateReviewDto } from "../dtos/reviewDto";
import { IReview, ReviewModel } from "../models/reviewModel";

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

  async findAll(page: number, limit: number) {
    const query = {
      deletedAt: null,
    };
    const reviewsPromise = ReviewModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    const totalPromise = ReviewModel.countDocuments(query);

    const [reviews, total] = await Promise.all([reviewsPromise, totalPromise]);

    return { reviews, total };
  }

  async findOne(reviewId: string) {
    return ReviewModel.findOne({
      _id: reviewId,
    });
  }

  async findReviewsByUserId(page: number, limit: number, userId: string) {
    const query = {
      userId,
      deletedAt: null,
    };
    const reviewsPromise = ReviewModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    const totalPromise = ReviewModel.countDocuments(query);

    const [reviews, total] = await Promise.all([reviewsPromise, totalPromise]);

    return { reviews, total };
  }

  async findReviewsByShowId(page: number, limit: number, showId: string) {
    const query = {
      showId,
      deletedAt: null,
    };
    const reviewsPromise = ReviewModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    const totalPromise = ReviewModel.countDocuments(query);

    const [reviews, total] = await Promise.all([reviewsPromise, totalPromise]);

    return { reviews, total };
  }

  async findReviewsByUserIdAndShowId(
    page: number,
    limit: number,
    userId: string,
    showId: string,
  ) {
    const query = {
      userId,
      showId,
      deletedAt: null,
    };
    const reviewsPromise = ReviewModel.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
    const totalPromise = ReviewModel.countDocuments(query);

    const [reviews, total] = await Promise.all([reviewsPromise, totalPromise]);

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
