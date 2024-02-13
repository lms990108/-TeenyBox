import { Request, Response } from "express";
import showService from "../services/showService";
import { ShowResponseDto } from "../dtos/showDto";
import { ShowOrder } from "../common/enum/show-order.enum";
import { IShow } from "../models/showModel";

class ShowController {
  async findShows(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || undefined;
    const limit = parseInt(req.query.limit as string) || undefined;
    const title = req.query.title as string;
    let state = req.query.state as string | string[];
    let region = req.query.region as string | string[];
    const order: ShowOrder = (req.query.order as ShowOrder) || ShowOrder.RECENT;
    const lowPrice = req.query.lowPrice as string;
    const highPrice = req.query.highPrice as string;
    const date = req.query.date as string;
    const location = req.query.location as string;

    const match = {};
    let sort;

    if (title) match["title"] = { $regex: title, $options: "i" };

    if (state && typeof state === "string") {
      state = [state];
      match["state"] = { $in: state };
    } else if (state && Array.isArray(state) && state.length > 1) {
      match["state"] = { $in: state };
    }

    if (region && typeof region === "string") {
      region = [region];
      match["region"] = { $in: region };
    } else if (region && Array.isArray(region) && region.length > 1) {
      match["region"] = { $in: region };
    }

    if (lowPrice || highPrice) {
      match["max_price"] = {};
      match["min_price"] = {};
      if (lowPrice) match["min_price"].$gte = +lowPrice;
      if (highPrice) match["max_price"].$lte = +highPrice;
    }

    if (date) {
      const parsedDate = new Date(date);
      match["start_date"] = { $lte: parsedDate };
      match["end_date"] = { $gte: parsedDate };
    }

    if (location) match["location"] = { $regex: location };

    if (order) {
      switch (order) {
        case ShowOrder.RECENT:
          sort = { start_date: -1 };
          break;
        case ShowOrder.HIGH_RATE:
          sort = { avg_rating: -1 };
          break;
        case ShowOrder.LOW_PRICE:
          sort = { price_number: 1 };
          break;
      }
    }

    const { shows, total } = await showService.findShows(
      match,
      sort,
      page,
      limit,
    );

    const showDtos = await Promise.all(
      shows.map(async (show: IShow) => new ShowResponseDto(show)),
    );

    return res.status(200).json({
      shows: showDtos,
      total,
    });
  }

  async findShowsByRank(req: Request, res: Response) {
    const shows = await showService.findShowsByRank();
    return res
      .status(200)
      .json({ shows: shows.map((show) => new ShowResponseDto(show)) });
  }

  async findShowsForChildren(req: Request, res: Response) {
    const shows = await showService.findShowsForChildren();
    return res
      .status(200)
      .json({ shows: shows.map((show) => new ShowResponseDto(show)) });
  }

  async findShowsNumberByDate(req: Request, res: Response) {
    const showsNumberByDate = await showService.findShowsNumberByDate();
    return res.status(200).json({ showsNumberByDate: showsNumberByDate });
  }

  async findShowByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.id as string;
    const show = await showService.findShowByShowId(showId);
    const showResponseDto = new ShowResponseDto(show);

    return res.status(200).json({ show: showResponseDto });
  }

  async deleteByShowId(req: Request, res: Response): Promise<Response> {
    const showId = req.params.id as string;
    await showService.deleteByShowId(showId);
    return res.status(200).json({ showId, message: "삭제되었습니다." });
  }
}

export default new ShowController();
