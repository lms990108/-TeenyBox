import { Request, Response } from "express";
import PromotionService from "../services/promotionService";

class PromotionController {
  async createPromotion(req: Request, res: Response): Promise<Response> {
    const promotion = await PromotionService.create(req.body);
    return res.status(201).json(promotion);
  }

  async updatePromotion(req: Request, res: Response): Promise<void> {
    const promotionNumber = Number(req.params.Promotion_number);
    const promotion = await PromotionService.update(promotionNumber, req.body);
    res.status(200).json(promotion);
  }

  async getAllPromotions(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const promotions = await PromotionService.findAll(page, limit);
    res.status(200).json(promotions);
  }

  async getPromotionByNumber(req: Request, res: Response): Promise<void> {
    const promotion = await PromotionService.findByPromotionNumber(
      Number(req.params.Promotion_number),
    );
    res.status(200).json(promotion);
  }

  async getPromotionsByUserId(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const promotions = await PromotionService.findPromotionsByUserId(
      req.params.userId,
      page,
      limit,
    );
    res.status(200).json(promotions);
  }

  async deletePromotionByNumber(req: Request, res: Response): Promise<void> {
    const promotion = await PromotionService.deleteByPromotionNumber(
      Number(req.params.promotionNumber),
    );
    res.status(200).json(promotion);
  }
}

export default new PromotionController();
