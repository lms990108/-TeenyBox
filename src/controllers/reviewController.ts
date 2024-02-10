import { Request, Response } from "express";
import reviewService from "../services/reviewService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import { ReviewResponseDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";
import { ReviewOrder } from "../common/enum/review-order.enum";

class ReviewController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.user.user_id;
    const showId = req.params.showId;
    const createReviewDto = req.body;

    const review = await reviewService.create(userId, showId, createReviewDto);
    return res.status(201).json({ review: new ReviewResponseDto(review) });
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    const reviewId = req.params.id as string;
    const userId = req.user.user_id;
    const updateReviewDto = req.body;

    const review = await reviewService.update(
      userId,
      reviewId,
      updateReviewDto,
    );
    return res.status(201).json({ review: new ReviewResponseDto(review) });
  }

  async deleteOne(req: AuthRequest, res: Response): Promise<Response> {
    const reviewId = req.params.id;
    const user = req.user;

    await reviewService.deleteOne(user, reviewId);

    return res
      .status(200)
      .json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  }

  async deleteMany(req: AuthRequest, res: Response): Promise<Response> {
    const reviewIds = req.body.reviewIds;
    const user = req.user;
    await reviewService.deleteMany(user, reviewIds);

    return res
      .status(200)
      .json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const reviewId = req.params.id;

    const review = await reviewService.findOne(reviewId);
    return res.status(200).json({ review: new ReviewResponseDto(review) });
  }

  async findReviews(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const userId = req.query.userId as string;
    const showId = req.query.showId as string;
    const order: ReviewOrder =
      (req.query.order as ReviewOrder) || ReviewOrder.RECENT;

    const match = { deletedAt: null };
    let sort;

    if (userId) match["userId"] = userId;
    if (showId) match["showId"] = showId;
    if (order) {
      switch (order) {
        case ReviewOrder.RECENT:
          sort = { createdAt: -1 };
          break;
        case ReviewOrder.HIGH_RATE:
          sort = { rate: -1 };
          break;
      }
    }

    const { reviews, total } = await reviewService.findReviews(
      match,
      sort,
      page,
      limit,
    );

    return res.status(200).json({
      data: reviews.map((review: IReview) => new ReviewResponseDto(review)),
      total,
    });
  }
}

export default new ReviewController();
