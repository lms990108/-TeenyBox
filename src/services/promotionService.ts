import PromotionRepository from "../repositories/promotionRepository";
import { CreatePromotionDTO, UpdatePromotionDTO } from "../dtos/promotionDto";
import { IPromotion } from "../models/promotionModel";
import NotFoundError from "../common/error/NotFoundError";
import InternalServerError from "../common/error/InternalServerError";
import { UserModel } from "../models/userModel";
import { uploadImageToS3 } from "../common/utils/awsS3Utils";

class PromotionService {
  // 게시글 생성
  async create(
    promotionData: CreatePromotionDTO,
    userId: string,
    imageFile: Express.Multer.File,
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

      // 이미지 파일을 S3에 업로드하고, URL을 받습니다.
      const imageUrl = await uploadImageToS3(
        imageFile,
        `promotions/${Date.now()}_${imageFile.originalname}`,
      );

      // S3에서 반환된 이미지 URL을 promotionData에 추가합니다.
      const promotionDataWithImage = {
        ...promotionData,
        poster_image: imageUrl,
        user_id: userId,
      };

      // 데이터베이스에 게시글을 생성하고, 생성된 게시글 객체를 반환합니다.
      return PromotionRepository.create(promotionDataWithImage);
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
  ): Promise<IPromotion | null> {
    const updatedPromotion = await PromotionRepository.update(
      promotionNumber,
      updateData,
    );
    if (!updatedPromotion) {
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
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
      throw new NotFoundError("게시글을 찾을 수 없습니다.");
    }
    return deletedPromotion;
  }
}

export default new PromotionService();
