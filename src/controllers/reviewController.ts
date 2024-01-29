import { Request, Response } from "express";
import reviewService from "../services/reviewService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import { ReviewResponseDto } from "../dtos/reviewDto";
import { IReview } from "../models/reviewModel";

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

    await reviewService.deleteOne(user, reviewId);

    return res
      .status(200)
      .json({ message: "리뷰가 성공적으로 삭제되었습니다." });
  }

  async deleteMany(req: AuthRequest, res: Response): Promise<Response> {
    const user = req.user;
    const reviewIds = req.body.review_ids;

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

  async findAll(req: Request, res: Response): Promise<Response> {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const userId = req.query.userId as string;
    const showId = req.query.showId as string;
    let reviews: IReview[], total: number;

    if (userId && showId)
      ({ reviews, total } = await reviewService.findReviewsByUserIdAndShowId(
        page,
        limit,
        userId,
        showId,
      ));
    else if (showId)
      ({ reviews, total } = await reviewService.findReviewsByShowId(
        page,
        limit,
        showId,
      ));
    else if (userId)
      ({ reviews, total } = await reviewService.findReviewsByUserId(
        page,
        limit,
        userId,
      ));
    else ({ reviews, total } = await reviewService.findAll(page, limit));

    return res.status(200).json({
      reviews: reviews.map((review: IReview) => new ReviewResponseDto(review)),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    });
  }
}

export default new ReviewController();
