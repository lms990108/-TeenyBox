import { Request, Response } from "express";
import showService from "../services/showService";
import { ShowResponseDto } from "../dtos/showDto";
import { ReviewModel } from "../models/reviewModel";

class ShowController {
  async findShows(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const title = req.query.title as string;
    const state = req.query.state as string;
    const region = req.query.region as string;

    const shows = await showService.findShows(
      title,
      state,
      region,
      page,
      limit,
    );

    const showDtos = await Promise.all(
      shows.map(async (show) => {
        const reviews = await ReviewModel.find({ _id: { $in: show.reviews } });
        let avgRating = 0;

        if (reviews.length > 0) {
          const totalRating = reviews.reduce(
            (sum, review) => sum + review.rate,
            0,
          );
          avgRating = totalRating / reviews.length;
        }

        const showResponseDto = new ShowResponseDto(show);
        showResponseDto.avg_rating = avgRating;
        return showResponseDto;
      }),
    );

    return res.status(200).json({
      shows: showDtos,
    });
  }

  async findShowByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.id as string;
    const show = await showService.findShowByShowId(showId);
    const reviews = await ReviewModel.find({ _id: { $in: show.reviews } });
    let avgRating = 0;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rate, 0);
      avgRating = totalRating / reviews.length;
    }

    const showResponseDto = new ShowResponseDto(show);
    showResponseDto.avg_rating = avgRating;

    return res.status(200).json({ show: showResponseDto });
  }

  async deleteByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.id as string;
    await showService.deleteByShowId(showId);
    return res.status(200).json({ showId, message: "삭제되었습니다." });
  }
}

export default new ShowController();
