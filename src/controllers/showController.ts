import { Request, Response } from "express";
import showService from "../services/showService";
import { ShowResponseDto } from "../dtos/showDto";
import { ReviewModel } from "../models/reviewModel";
import { ShowOrder } from "../common/enum/showOrder.enum";
import { IShow } from "../models/showModel";
import ShowRepository from "../repositories/showRepository";

class ShowController {
  async findShows(req: Request, res: Response): Promise<Response> {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const title = req.query.title as string;
    let state = req.query.state as string | string[];
    let region = req.query.region as string | string[];
    const order: ShowOrder = (req.query.order as ShowOrder) || ShowOrder.RECENT;
    const lowPrice = req.query.lowPrice as string;
    const highPrice = req.query.highPrice as string;

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

    if (lowPrice && !highPrice) {
      match["price"] = { $gte: lowPrice };
    } else if (highPrice && !lowPrice) {
      match["price"] = { $lte: highPrice };
    } else if (lowPrice && highPrice) {
      match["price"] = { $gte: lowPrice, $lte: highPrice };
    }

    if (order) {
      switch (order) {
        case ShowOrder.RECENT:
          sort = { updated_at: -1 };
          break;
        case ShowOrder.HIGH_RATE:
          sort = { avg_rating: 1 };
          break;
        case ShowOrder.LOW_PRICE:
          sort = { price: -1 };
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
      shows.map(async (show) => new ShowResponseDto(show)),
    );

    return res.status(200).json({
      data: showDtos,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    });
  }

  async findShowsByRank(req: Request, res: Response) {
    const shows = await showService.findShowsByRank();
    return res
      .status(200)
      .json({ shows: shows.map((show) => new ShowResponseDto(show)) });
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
