import PromotionRepository from "../repositories/promotionRepository";
import { CreatePromotionDTO, UpdatePromotionDTO } from "../dtos/promotionDto";
import { IPromotion } from "../models/promotionModel";
import NotFoundError from "../common/error/NotFoundError";
import InternalServerError from "../common/error/InternalServerError";
import UnauthorizedError from "../common/error/UnauthorizedError";
import { UserModel } from "../models/userModel";

class PromotionService {
  // 게시글 생성
  async create(
    promotionData: CreatePromotionDTO,
    userId: string,
  ): Promise<IPromotion> {
    try {
      // 태그가 문자열로 들어왔다면 배열로 변환
      if (typeof promotionData.tags === "string") {
        promotionData.tags = promotionData.tags
          .split(",")
          .map((tag) => tag.trim());
      } else if (Array.isArray(promotionData.tags)) {
        // tags 필드가 이미 배열이라면, 각 요소를 trim 처리
        promotionData.tags = promotionData.tags.map((tag) =>
          typeof tag === "string" ? tag.trim() : tag,
        );
      }

      // 사용자 정보 조회
      const user = await UserModel.findOne({ _id: userId });
      if (!user) {
        throw new NotFoundError("사용자를 찾을 수 없습니다.");
      }

      // user정보 추가
      const promotionDataWithUser = {
        ...promotionData,
        user_id: userId,
      };

      // 데이터베이스에 게시글을 생성하고, 생성된 게시글 객체를 반환합니다.
      const newPromotion = await PromotionRepository.create(
        promotionDataWithUser,
      );
      return newPromotion;
    } catch (error) {
      throw new InternalServerError(
        `게시글을 생성하는데 실패했습니다. ${error.message}`,
      );
    }
  }

  // 게시글 수정
  async update(
    promotionNumber: number,
    updateData: UpdatePromotionDTO,
    userId: string,
  ): Promise<IPromotion | null> {
    // 게시글 조회
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    if (promotion.user_id["_id"].toString() !== userId.toString()) {
      throw new UnauthorizedError("게시글 수정 권한이 없습니다.");
    }

    const updatedPromotion = await PromotionRepository.update(
      promotionNumber,
      updateData,
    );

    return updatedPromotion;
  }

  // 게시글 전체 조회 & 페이징
  async findAll(page: number, limit: number): Promise<IPromotion[]> {
    const skip = (page - 1) * limit;
    return await PromotionRepository.findAll(skip, limit);
  }

  // 게시글 번호로 조회
  async findByPromotionNumber(promotionNumber: number): Promise<IPromotion> {
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
    return promotion;
  }

  // userId로 게시글들 조회
  async findPromotionsByUserId(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{ promotions: IPromotion[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    return await PromotionRepository.findPromotionsByUserIdWithCount(
      userId,
      skip,
      limit,
    );
  }

  // 게시글 삭제 (PromotionNumber를 기반으로)
  async deleteByPromotionNumber(
    promotionNumber: number,
    userId: string,
  ): Promise<IPromotion> {
    // 게시글 조회 -> 권한 확인 -> 삭제

    // 1. 게시글 조회
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 2. 권한체크
    if (promotion.user_id["_id"].toString() !== userId.toString()) {
      throw new UnauthorizedError("게시글 삭제 권한이 없습니다.");
    }

    // 3. 삭제
    const deletedPromotion =
      await PromotionRepository.deleteByPromotionNumber(promotionNumber);

    return deletedPromotion;
  }

  // 게시글 제목 검색
  async findByTitle(
    title: string,
    page: number,
    limit: number,
  ): Promise<IPromotion[]> {
    const encodedTitle = encodeURIComponent(title); // 한글을 URL 인코딩
    const skip = (page - 1) * limit;
    return await PromotionRepository.findByTitle(encodedTitle, skip, limit);
  }

  // 게시글 일괄 삭제
  async deleteMultipleByPromotionNumbers(
    promotionNumbers: number[],
    userId: string,
  ): Promise<void> {
    const posts =
      await PromotionRepository.findMultipleByPromotionNumbers(
        promotionNumbers,
      );
    const authorizedPosts = posts.filter(
      (post) => post.user_id["_id"].toString() === userId.toString(),
    );

    if (authorizedPosts.length !== promotionNumbers.length) {
      throw new UnauthorizedError("삭제 권한이 없습니다.");
    }

    await PromotionRepository.deleteMultipleByPromotionNumbers(
      promotionNumbers,
    );
  }
}

export default new PromotionService();
