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

  // 게시글 전체 조회 & 페이징 + 게시글 댓글
  async findAllWithCommentsCount(
    skip: number,
    limit: number,
  ): Promise<{ promotions: any[]; totalCount: number }> {
    // 전체 게시글 수를 계산
    const totalCount = await PromotionModel.countDocuments();

    const promotions = await PromotionModel.aggregate([
      {
        $lookup: {
          from: "comments", // `comments` 컬렉션과 조인
          localField: "_id",
          foreignField: "promotion",
          as: "comments",
        },
      },
      {
        $addFields: {
          commentsCount: { $size: "$comments" }, // 댓글 수 계산
        },
      },
      {
        $project: {
          comments: 0, // 결과에서 댓글 데이터 제외
        },
      },
      { $sort: { promotion_number: -1 } }, // 게시글 번호로 내림차순 정렬
      { $skip: skip }, // 스킵
      { $limit: limit }, // 리밋
    ]).exec();

    return { promotions, totalCount };
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
  async findPromotionsByUserIdWithCount(
    userId: string,
    skip: number,
    limit: number,
  ): Promise<{ promotions: IPromotion[]; totalCount: number }> {
    // 게시글 총 갯수를 가져오는 쿼리
    const totalCount = await PromotionModel.countDocuments({ user_id: userId });

    const promotions = await PromotionModel.find({ user_id: userId })
      .sort({ promotion_number: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "nickname profile_url")
      .exec();

    return { promotions, totalCount };
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

  // 게시글 제목으로 검색
  async findByTitle(
    title: string,
    skip: number,
    limit: number,
  ): Promise<{ promotions: IPromotion[]; totalCount: number }> {
    const promotions = await PromotionModel.find({
      title: new RegExp(title, "i"),
    })
      .sort({ promotion_number: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // 총 게시글 개수 조회
    const totalCount = await PromotionModel.countDocuments({
      title: new RegExp(title, "i"),
    });

    return { promotions, totalCount };
  }

  async findMultipleByPromotionNumbers(
    promotionNumbers: number[],
  ): Promise<IPromotion[]> {
    return await PromotionModel.find({
      promotion_number: { $in: promotionNumbers },
    })
      .populate({ path: "user_id", select: "nickname profile_url _id" })
      .exec();
  }

  async deleteMultipleByPromotionNumbers(
    promotionNumbers: number[],
  ): Promise<void> {
    await PromotionModel.deleteMany({
      promotion_number: { $in: promotionNumbers },
    }).exec();
  }
}

export default new promotionRepository();
