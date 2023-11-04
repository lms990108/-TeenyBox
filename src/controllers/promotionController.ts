import { Request, Response } from "express";
import PromotionService from "../services/promotionService";
import { MulterRequest } from "../interfaces/MulterRequest";

class PromotionController {
  // 컨트롤러
  async createPromotion(req: MulterRequest, res: Response): Promise<void> {
    // 이미지 URL을 DTO에 포함시킵니다.
    const promotionDataWithImage = {
      ...req.body,
      posterImage: req.body.poster_image,
    };

    const promotion = await PromotionService.create(promotionDataWithImage);
    res.status(201).json(promotion);
  }

  async updatePromotion(req: Request, res: Response): Promise<void> {
    const promotionNumber = Number(req.params.promotionNumber);
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
      Number(req.params.promotionNumber),
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
