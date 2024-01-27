import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import PromotionService from "../services/promotionService";

class PromotionController {
  async createPromotion(req: AuthRequest, res: Response): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    try {
      const promotion = await PromotionService.create(req.body, req.user._id);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updatePromotion(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }

    const promotionNumber = Number(req.params.promotionNumber);
    const promotion = await PromotionService.update(
      promotionNumber,
      req.body,
      req.user._id,
    );
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

  async deletePromotionByNumber(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    // 인증된 사용자의 정보가 있는지 확인합니다.
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }
    const promotion = await PromotionService.deleteByPromotionNumber(
      Number(req.params.promotionNumber),
      req.user._id,
    );
    res.status(200).json(promotion);
  }
}

export default new PromotionController();
