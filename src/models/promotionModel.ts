import mongoose, { Document, Schema } from "mongoose";

export interface IPromotion extends Document {
  promotion_number: number;
  user_id: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  tags?: string[];
  image_url: string[];
  createdAt?: Date;
  updatedAt?: Date;
  comments: mongoose.Schema.Types.ObjectId[];
  start_date: Date; // 상영 시작일
  end_date: Date; // 상영 종료일
  likes: number; // 추천수
  views: number; // 조회수
  likedUsers: string[]; // 추천한 사용자의 ID 목록
}

const promotionSchema = new Schema<IPromotion>(
  {
    promotion_number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true, // 검색기능을 위한 인덱싱
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    image_url: {
      type: [String],
      required: false,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: 0, // 기본값을 0으로 설정
    },
    views: {
      type: Number,
      required: true,
      default: 0, // 기본값을 0으로 설정
    },
    likedUsers: {
      type: [String],
      ref: "User",
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const PromotionModel = mongoose.model<IPromotion>("Promotion", promotionSchema);

export default PromotionModel;
