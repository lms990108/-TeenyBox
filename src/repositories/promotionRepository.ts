import PromotionModel, { IPromotion } from "../models/promotionModel";
import { CreatePromotionDTO, UpdatePromotionDTO } from "../dtos/promotionDto";

class promotionRepository {
  // 게시글 생성
  async create(promotionData: CreatePromotionDTO): Promise<IPromotion> {
    // 최신 게시글의 promotion_number 조회
    const latestPromotion = await PromotionModel.findOne().sort({
      promotion_number: -1,
    });

    // 최신 게시글의 promotion_number가 있다면 그 값에 1을 더하고, 없다면 1로 설정
    const nextPromotionNumber =
      latestPromotion && latestPromotion.promotion_number
        ? latestPromotion.promotion_number + 1
        : 1;

    promotionData.promotion_number = nextPromotionNumber;

    const promotion = new PromotionModel(promotionData);
    return await promotion.save();
  }

  // 게시글 수정
  async update(
    promotion_number: number,
    updateData: UpdatePromotionDTO,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findOneAndUpdate(
      { promotion_number: promotion_number },
      updateData,
      {
        new: true,
      },
    );
  }

  // 게시글 전체 조회 & 페이징
  async findAll(skip: number, limit: number): Promise<IPromotion[]> {
    return await PromotionModel.find()
      .sort({ promotion_number: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "nickname profile_url")
      .exec();
  }

  // 게시글 번호로 조회
  async findByPromotionNumber(
    promotionNumber: number,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findOne({ promotion_number: promotionNumber })
      .populate("user_id", "nickname profile_url")
      .exec();
  }

  // userId로 게시글들 조회
  async findPromotionsByUserId(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<IPromotion[]> {
    return await PromotionModel.find({ user_id: userId })
      .sort({ promotion_number: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "nickname profile_url")
      .exec();
  }

  // 게시글 삭제 (promotionNumber를 기반으로)
  async deleteByPromotionNumber(
    promotionNumber: number,
  ): Promise<IPromotion | null> {
    // 게시글이 없다면 null을 반환, 대신 이에 대한 에러 처리는 서비스에서 반드시 이루어져야 할 것
    // 게시글 조회 및 삭제 (조회 결과 리턴 = 삭제된 게시글)
    const promotionToDelete = await PromotionModel.findOneAndDelete({
      promotion_number: promotionNumber,
    });
    return promotionToDelete;
  }

  async findByTitle(
    title: string,
    skip: number,
    limit: number,
  ): Promise<IPromotion[]> {
    return await PromotionModel.find({ title: new RegExp(title, "i") })
      .sort({ promotion_number: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
}

export default new promotionRepository();
