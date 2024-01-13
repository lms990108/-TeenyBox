import { Request, Response } from "express";
import reviewService from "../services/reviewService";

class ReviewController {
  async create(req: Request, res: Response): Promise<Response> {}

  async update(req: Request, res: Response): Promise<Response> {
    const reviewid = req.params.reviewId as string;
    const reviewData = req.body;

    const review = await reviewService.update(reviewid, reviewData);
    return res.status(201).json({ review });
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const page = +req.query.page;
    const limit = +req.query.limit;

    const reviews = await reviewService.findAll(page, limit);
    return res.status(200).json({ reviews });
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const reviewId = req.params.reviewId;

    const review = await reviewService.findOne(reviewId);
    return res.status(200).json({ review });
  }

  async findReviewsByUserId(req: Request, res: Response): Promise<Response> {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const userId = req.params.userId;

    const reviews = await reviewService.findReviewsByUserId(
      page,
      limit,
      userId,
    );
    return res.status(200).json({ reviews });
  }

  async findReviewsByPostId(req: Request, res: Response): Promise<Response> {
    const page = +req.query.page;
    const limit = +req.query.limit;
    const postId = +req.params.postId;

    const reviews = await reviewService.findReviewsByPostId(
      page,
      limit,
      postId,
    );
    return res.status(200).json({ reviews });
  }

  async deleteOne(req: Request, res: Response): Promise<Response> {
    const reviewId = req.params.reviewId;

    const review = await reviewService.deleteOne(reviewId);
    return res.status(200).json({ review });
  }
}

export default new ReviewController();
