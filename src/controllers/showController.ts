import { Request, Response } from "express";
import showService from "../services/showService";

class ShowController {
  async findShows(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.query as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const shows = await showService.findShows(page, limit);
    return res.status(200).json({ shows });
  }

  async findShowByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.showId as string;

    const show = await showService.findShowByShowId(showId);
    return res.status(200).json(show);
  }

  async findShowByTitle(req: Request, res: Response): Promise<Response> {
    const title = req.query.title as string;

    const show = await showService.findShowByTitle(title);
    return res.status(200).json(show);
  }

  async search(req: Request, res: Response): Promise<Response> {
    const title = req.query.title as string;
    const state = req.query.state as string;
    const region = req.query.region as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const shows = await showService.search(title, state, region, page, limit);
    return res.status(200).json(shows);
  }

  async deleteByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.showId as string;
    await showService.deleteByShowId(showId);
    return res.status(200).json({ showId, message: "삭제되었습니다." });
  }
}

export default new ShowController();
