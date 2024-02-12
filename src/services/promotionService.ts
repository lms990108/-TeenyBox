import PromotionRepository from "../repositories/promotionRepository";
import { CreatePromotionDTO, UpdatePromotionDTO } from "../dtos/promotionDto";
import { IPromotion } from "../models/promotionModel";
import NotFoundError from "../common/error/NotFoundError";
import InternalServerError from "../common/error/InternalServerError";
import UnauthorizedError from "../common/error/UnauthorizedError";
import { UserModel } from "../models/userModel";
import { IUser } from "../models/userModel";
import { FilterQuery } from "mongoose";
import { ROLE } from "../common/enum/enum";
import commentService from "./commentService";

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
    if (!promotion || promotion.deletedAt != null) {
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
  async getAllPromotions(
    page: number,
    limit: number,
    sortBy: string, // 정렬 기준
    sortOrder: "asc" | "desc", // 정렬 순서
    category: string,
  ): Promise<{
    promotions: Array<IPromotion & { commentsCount: number }>;
    totalCount: number;
  }> {
    const skip = (page - 1) * limit;
    const filter: FilterQuery<IPromotion> = {}; // 필터 타입 지정

    // 카테고리 값에 따라 필터 설정
    if (category && (category === "연극" || category === "기타")) {
      filter.category = category;
    }
    filter.deletedAt = null;

    return await PromotionRepository.findAll(
      skip,
      limit,
      sortBy,
      sortOrder,
      filter,
    );
  }

  // 게시글 번호로 조회
  async findByPromotionNumber(promotionNumber: number): Promise<IPromotion> {
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion || promotion.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 조회수 증가 로직 추가
    promotion.views = (promotion.views || 0) + 1;
    await promotion.save(); // 변경된 조회수 저장

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
    user: IUser,
  ): Promise<IPromotion> {
    // 1. 게시글 조회
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 2. 권한체크
    if (
      promotion.user_id["_id"].toString() !== user._id.toString() &&
      user.role !== ROLE.ADMIN
    ) {
      throw new UnauthorizedError("게시글 삭제 권한이 없습니다.");
    }

    // 3. 삭제
    const deletedPromotion =
      await PromotionRepository.deleteByPromotionNumber(promotionNumber);
    commentService.deleteCommentsByPromotionId(promotion._id);

    return deletedPromotion;
  }

  // 통합 검색
  async searchPromotions(
    type: string,
    query: string,
    page: number,
    limit: number,
  ): Promise<{ promotions: IPromotion[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    let searchQuery;
    if (type === "title") {
      searchQuery = {
        title: { $regex: query, $options: "i" },
        deletedAt: null,
      };
    } else if (type === "tag") {
      searchQuery = {
        tags: { $regex: query, $options: "i" },
        deletedAt: null,
      };
    } else if (type === "play_title") {
      searchQuery = {
        play_title: { $regex: query, $options: "i" },
        deletedAt: null,
      };
    } else {
      throw new Error("잘못된 타입입니다.");
    }

    return await PromotionRepository.findByQuery(searchQuery, skip, limit);
  }

  // 게시글 일괄 삭제
  async deleteMany(promotionNumbers: number[], user: IUser): Promise<void> {
    const promotions = await PromotionRepository.findMany(promotionNumbers);

    if (user.role !== ROLE.ADMIN) {
      // 사용자가 관리자가 아닌 경우에만 권한 확인
      const authorizedpromotions = promotions.filter(
        (promotion) =>
          promotion.user_id["_id"].toString() === user._id.toString(),
      );

      if (authorizedpromotions.length !== promotionNumbers.length) {
        throw new UnauthorizedError("삭제 권한이 없습니다.");
      }
    }

    await PromotionRepository.deleteMany(promotionNumbers);

    // 댓글 삭제용 반복문
    for (const promotionNumber of promotionNumbers) {
      const promotion =
        await PromotionRepository.findByPromotionNumber(promotionNumber);
      commentService.deleteCommentsByPromotionId(promotion._id);
    }
  }

  // 게시글 추천
  async likePromotion(
    promotionNumber: number,
    userId: string,
  ): Promise<IPromotion> {
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion || promotion.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 사용자가 이미 추천했는지 확인
    if (promotion.likedUsers.includes(userId)) {
      throw new Error("이미 추천한 게시글입니다.");
    }

    // 중복 추천이 아닌 경우, 사용자 ID를 배열에 추가
    promotion.likedUsers.push(userId);

    // 클라이언트에는 추천 수를 배열의 크기로 제공

    promotion.likes = promotion.likedUsers.length;
    await promotion.save();
    return promotion;
  }

  // 게시글 추천 취소
  async cancelLikePromotion(
    promotionNumber: number,
    userId: string,
  ): Promise<IPromotion> {
    const promotion =
      await PromotionRepository.findByPromotionNumber(promotionNumber);
    if (!promotion || promotion.deletedAt != null) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }

    // 사용자가 이미 추천했는지 확인
    if (!promotion.likedUsers.includes(userId)) {
      throw new Error("아직 추천하지 않은 게시글입니다.");
    }

    // 추천했다면, 삭제해서 새로운 배열 추가
    promotion.likedUsers = promotion.likedUsers.filter(
      (user) => user !== userId.toString(),
    );

    // 클라이언트에는 추천 수를 배열의 크기로 제공
    promotion.likes = promotion.likedUsers.length;
    await promotion.save();
    return promotion;
  }
}

export default new PromotionService();
