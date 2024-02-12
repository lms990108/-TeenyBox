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
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const sortBy = String(req.query.sortBy) || "promotion_number";
      const sortOrder = String(req.query.sortOrder) === "desc" ? "desc" : "asc";
      const category = String(req.query.category);

      const promotions = await PromotionService.getAllPromotions(
        page,
        limit,
        sortBy,
        sortOrder,
        category,
      );
      res.status(200).json(promotions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 번호로 상세조회
  async getPromotionByNumber(req: Request, res: Response): Promise<void> {
    const promotion = await PromotionService.findByPromotionNumber(
      Number(req.params.promotionNumber),
    );
    res.status(200).json(promotion);
  }

  // 유저 id로 게시글 검색 (리스트반환)
  async getPromotionsByUserId(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 0);
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
    const user = req.user;

    const promotion = await PromotionService.deleteByPromotionNumber(
      Number(req.params.promotionNumber),
      user,
    );
    res.status(200).json(promotion);
  }

  // 통합 검색
  async searchPromotions(req: Request, res: Response): Promise<void> {
    try {
      const type = req.query.type as string; // 'title' 또는 'tag'
      const query = req.query.query as string; // 검색어
      const page = Number(req.query.page || 1); // 페이지 번호, 기본값은 1
      const limit = Number(req.query.limit || 10); // 페이지 당 항목 수, 기본값은 10

      // 검색 유형과 검색어가 모두 제공되었는지 확인
      if (!type || !query) {
        res.status(400).json({ message: "타입과 검색어를 입력하세요." });
        return;
      }

      // 서비스 로직을 호출하여 검색 수행
      const searchResults = await PromotionService.searchPromotions(
        type,
        query,
        page,
        limit,
      );

      // 검색 결과 반환
      res.status(200).json(searchResults);
    } catch (error) {
      // 오류 처리
      res.status(500).json({ message: error.message });
    }
  }

  // 게시글 일괄 삭제
  async deleteMultiplePromotions(
    req: AuthRequest,
    res: Response,
  ): Promise<void> {
    const user = req.user;
    const promotionNumbers = req.body.promotionNumbers;
    const deletedPromotions = await PromotionService.deleteMany(
      promotionNumbers,
      user,
    );
    res.status(200).json(deletedPromotions);
  }

  // 게시글 추천
  async likePromotion(req: AuthRequest, res: Response): Promise<void> {
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

  // 게시글 추천 취소
  async cancelLikePromotion(req: AuthRequest, res: Response): Promise<void> {
    const promotionNumber = Number(req.params.promotionNumber);

    try {
      const updatedPromotion = await PromotionService.cancelLikePromotion(
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
