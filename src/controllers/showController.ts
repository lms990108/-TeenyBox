import { Request, Response } from "express";
import { plainToClass } from "class-transformer";

import showService from "../services/showService";
import { SearchShowDTO } from "../dtos/showDto";

class showController {
  async findShows(req: Request, res: Response): Promise<Response> {
    const searchShowDTO = plainToClass(SearchShowDTO, req.query);
    const shows = await showService.findShows(searchShowDTO);
    return res.status(200).json(shows);
  }

  async findShowByShowId(req: Request, res: Response): Promise<Response> {
    const showId = Number(req.params.showId);
    const show = await showService.findShowByShowId(showId);
    return res.status(200).json(show);
  }

  async findShowByTitle(req: Request, res: Response): Promise<Response> {
    const { title } = req.params;
    const show = await showService.findShowByTitle(title);
    return res.status(200).json(show);
  }

  async searchByTitle(req: Request, res: Response): Promise<Response> {
    const searchShowDTO = plainToClass(SearchShowDTO, req.query);
    const shows = await showService.searchByTitle(searchShowDTO);
    return res.status(200).json(shows);
  }

  async searchByStatus(req: Request, res: Response): Promise<Response> {
    const searchShowDTO = plainToClass(SearchShowDTO, req.query);
    const shows = await showService.searchByStatus(searchShowDTO);
    return res.status(200).json(shows);
  }

  async searchByRegion(req: Request, res: Response): Promise<Response> {
    const searchShowDTO = plainToClass(SearchShowDTO, req.query);
    const shows = await showService.searchByRegion(searchShowDTO);
    return res.status(200).json(shows);
  }

  async deleteByShowId(req: Request, res: Response): Promise<Response> {
    const showId = Number(req.params.showId);
    const show = await showService.deleteByShowId(showId);
    return res.status(200).json(show);
  }

  async deleteByTitle(req: Request, res: Response): Promise<Response> {
    const { title } = req.params;
    const show = await showService.deleteByTitle(title);
    return res.status(200).json(show);
  }
}

export default showController;
