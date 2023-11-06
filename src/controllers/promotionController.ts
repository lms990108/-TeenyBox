import { Request, Response } from "express";
import PromotionService from "../services/promotionService";
import { MulterRequest } from "../interfaces/MulterRequest";
import fs from "fs";
class PromotionController {
  // 컨트롤러
  async createPromotion(req: MulterRequest, res: Response): Promise<void> {
    const promotionDataWithImage = {
      ...req.body,
      posterImage: req.body.poster_image,
    };

    const promotion = await PromotionService.create(promotionDataWithImage);
    res.status(201).json(promotion);
  }

  async updatePromotionDefault(req: Request, res: Response): Promise<void> {
    const promotionNumber = Number(req.params.promotionNumber);
    const promotion = await PromotionService.update(promotionNumber, req.body);
    res.status(200).json(promotion);
  }

  async updatePromotion(req: MulterRequest, res: Response): Promise<void> {
    try {
      const promotionNumber = Number(req.params.promotionNumber);
      let updateData = req.body;

      // 이미지가 새로 업로드되었는지 확인
      if (req.body.poster_image) {
        const newImagePath = req.body.poster_image;
        updateData.poster_image = newImagePath; // 새 이미지 경로로 업데이트

        // 기존 이미지 정보를 가져오고 파일 시스템에서 삭제
        const currentPromotion =
          await PromotionService.findByPromotionNumber(promotionNumber);
        if (currentPromotion && currentPromotion.poster_image) {
          // fs.promises 모듈을 사용하여 기존 이미지를 삭제
          try {
            await fs.promises.unlink(currentPromotion.poster_image);
          } catch (unlinkError) {
            console.error(`Error deleting old image: ${unlinkError}`);
            // 이미지 삭제 중 오류가 발생했으나, 프로모션 업데이트는 계속 진행
          }
        }
      }

      // PromotionService의 update 메소드를 사용하여 업데이트
      const updatedPromotion = await PromotionService.update(
        promotionNumber,
        updateData,
      );

      res.status(200).json(updatedPromotion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
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
