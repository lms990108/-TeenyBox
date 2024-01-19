import { Request, Response } from "express";
import showService from "../services/showService";
import { ShowResponseDto } from "../dtos/showDto";

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

    return res
      .status(200)
      .json({ shows: shows.map((show) => new ShowResponseDto(show)) });
  }

  async findShowByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.id as string;

    const show = await showService.findShowByShowId(showId);
    return res.status(200).json({ show: new ShowResponseDto(show) });
  }

  async deleteByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.id as string;
    await showService.deleteByShowId(showId);
    return res.status(200).json({ showId, message: "삭제되었습니다." });
  }
}

export default new ShowController();
