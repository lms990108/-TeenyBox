import PromotionRepository from "../repositories/promotionRepository";
import { CreatePromotionDTO, UpdatePromotionDTO } from "../dtos/promotionDto";
import { IPromotion } from "../models/promotionModel";

class PromotionService {
  // 게시글 생성
  async create(PromotionData: CreatePromotionDTO): Promise<IPromotion> {
    return await PromotionRepository.create(PromotionData);
  }

  // 게시글 수정
  async update(
    promotion_number: number,
    updateData: UpdatePromotionDTO,
  ): Promise<IPromotion | null> {
    const updatedPromotion = await PromotionRepository.update(
      promotion_number,
      updateData,
    );
    if (!updatedPromotion) {
      throw new Error("Promotion not found");
    }
    return updatedPromotion;
  }

  // 게시글 전체 조회 & 페이징
  async findAll(page: number, limit: number): Promise<IPromotion[]> {
    const skip = (page - 1) * limit;
    return await PromotionRepository.findAll(skip, limit);
  }

  // 게시글 번호로 조회
  async findByPromotionNumber(PromotionNumber: number): Promise<IPromotion> {
    const Promotion =
      await PromotionRepository.findByPromotionNumber(PromotionNumber);
    if (!Promotion) {
      throw new Error("Promotion not found");
    }
    return Promotion;
  }

  // userId로 게시글들 조회
  async findPromotionsByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<IPromotion[]> {
    const skip = (page - 1) * limit;
    return await PromotionRepository.findPromotionsByUserId(
      userId,
      skip,
      limit,
    );
  }

  // 게시글 삭제 (PromotionNumber를 기반으로)
  async deleteByPromotionNumber(promotionNumber: number): Promise<IPromotion> {
    const deletedPromotion =
      await PromotionRepository.deleteByPromotionNumber(promotionNumber);
    if (!deletedPromotion) {
      throw new Error("Promotion not found");
    }
    return deletedPromotion;
  }
}

export default new PromotionService();
