import { Request, Response } from "express";
import reviewService from "../services/reviewService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import { ReviewResponseDto } from "../dtos/reviewDto";

class ReviewController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.user.user_id;
    const showId = req.params.showId;
    const reviewData = req.body;

    const review = await reviewService.create(userId, showId, reviewData);
    return res.status(201).json({ review: new ReviewResponseDto(review) });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const reviewid = req.params.reviewId as string;
    const reviewData = req.body;

    const review = await reviewService.update(reviewid, reviewData);
    return res.status(201).json({ review: new ReviewResponseDto(review) });
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const reviewId = req.params.reviewId;

    const review = await reviewService.findOne(reviewId);
    return res.status(200).json({ review });
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const userId = req.query.userId as string;
    const showId = req.query.showId as string;
    let reviews;

    if (userId && showId)
      reviews = await reviewService.findReviewsByUserIdAndShowId(
        page,
        limit,
        userId,
        showId,
      );
    else if (showId)
      reviews = await reviewService.findReviewsByShowId(page, limit, showId);
    else if (userId)
      reviews = await reviewService.findReviewsByUserId(page, limit, userId);
    else reviews = await reviewService.findAll(page, limit);

    return res.status(200).json({
      reviews: reviews.map((review) => new ReviewResponseDto(review)),
    });
  }

  async deleteOne(req: Request, res: Response): Promise<Response> {
    const reviewId = req.params.reviewId;

    const review = await reviewService.deleteOne(reviewId);
    return res.status(200).json({ review: new ReviewResponseDto(review) });
  }
}

export default new ReviewController();
