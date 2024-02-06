import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authUserMiddlewares";
import PromotionService from "../services/promotionService";

class PromotionController {
  // 게시글 생성
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

  // 게시글 수정
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

  // 게시글 전체 조회
  async getAllPromotions(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const promotions = await PromotionService.findAllWithCommentsCountAll(
      page,
      limit,
    );
    res.status(200).json(promotions);
  }

  async getPromotionByNumber(req: Request, res: Response): Promise<void> {
    const promotion = await PromotionService.findByPromotionNumber(
      Number(req.params.promotionNumber),
    );
    res.status(200).json(promotion);
  }

  // 유저 id로 게시글 검색 (리스트반환)
  async getPromotionsByUserId(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const { promotions, totalCount } =
      await PromotionService.findPromotionsByUserId(
        req.params.userId,
        page,
        limit,
      );

    res.status(200).json({ promotions, totalCount });
  }

  // 게시글 삭제
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

  // 게시글 제목으로 검색
  async searchPromotionsByTitle(req: Request, res: Response): Promise<void> {
    try {
      const title = req.query.title as string;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      // 검색어가 없는 경우, 빈 리스트 반환
      if (!title) {
        res.status(200).json([]);
        return;
      }

      // 검색어가 있는 경우, 검색 결과 반환
      const searchResults = await PromotionService.findByTitle(
        title,
        page,
        limit,
      );
      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 태그로 검색
  async searchPromotionsByTag(req: Request, res: Response): Promise<void> {
    try {
      const tag = req.query.tag as string;
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);

      // 검색어가 없는 경우, 빈 리스트 반환
      if (!tag) {
        res.status(200).json([]);
        return;
      }

      // 검색어가 있는 경우, 검색 결과 반환
      const searchResults = await PromotionService.findByTag(tag, page, limit);
      res.status(200).json(searchResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 일괄 삭제
  async deleteMultiplePromotions(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    if (!req.user) {
      res.status(401).json({ message: "사용자 인증이 필요합니다." });
      return;
    }
    const promotionNumbers = req.body.promotionNumbers; // 게시글 번호 배열
    const deletedPromotions =
      await PromotionService.deleteMultipleByPromotionNumbers(
        promotionNumbers,
        req.user._id,
      );
    res.status(200).json(deletedPromotions);
  }

  // 게시글 추천
  async likePromotion(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res
        .status(401)
        .json({ message: "로그인한 사용자만 추천할 수 있습니다." });
      return;
    }

    const promotionNumber = Number(req.params.promotionNumber);

    try {
      const updatedPromotion = await PromotionService.likePromotion(
        promotionNumber,
        req.user._id,
      );
      res.status(200).json(updatedPromotion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new PromotionController();
