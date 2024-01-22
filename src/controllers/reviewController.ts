import { Request, Response } from "express";
import reviewService from "../services/reviewService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import { ReviewResponseDto } from "../dtos/reviewDto";

class ReviewController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    const userId = req.user.user_id;
    const showId = req.params.showId;
    const createReviewDto = req.body;
    const detailImages = req.files as Express.Multer.File[];

    const review = await reviewService.create(
      userId,
      showId,
      createReviewDto,
      detailImages,
    );
    return res.status(201).json({ review: new ReviewResponseDto(review) });
  }

  async update(req: AuthRequest, res: Response): Promise<Response> {
    const reviewid = req.params.id as string;
    const userId = req.user.user_id;
    const updateReviewDto = req.body;
    const detailImages = req.files as Express.Multer.File[];

    const review = await reviewService.update(
      userId,
      reviewid,
      updateReviewDto,
      detailImages,
    );
    return res.status(201).json({ review: new ReviewResponseDto(review) });
  }

  async deleteOne(req: AuthRequest, res: Response): Promise<Response> {
    const reviewId = req.params.id;
    const user = req.user;

    const review = await reviewService.deleteOne(user, reviewId);
    return res.status(200).json({ review: new ReviewResponseDto(review) });
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const reviewId = req.params.id;

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
}

export default new ReviewController();
