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
  start_date: Date;
  end_date: Date;
  likes: number;
  views: number;
  likedUsers: string[];
  category: "연극" | "기타"; // 카테고리 필드 추가
  play_title?: string; // 연극제목 필드 추가
  runtime?: number; // 런타임 필드 추가
  location?: string; // 장소 필드 추가
  host?: string; // 주최 필드 추가
  deletedAt?: Date | null; // 삭제로직 변경을 위한 필드 추가
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
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
    },
    image_url: {
      type: [String],
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
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    likedUsers: {
      type: [String],
      ref: "User",
      default: [],
    },
    category: {
      type: String,
      enum: ["연극", "기타"],
      required: true,
    },
    play_title: {
      type: String,
    },
    runtime: {
      type: Number,
    },
    location: {
      type: String,
    },
    host: {
      type: String,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const PromotionModel = mongoose.model<IPromotion>("Promotion", promotionSchema);

export default PromotionModel;
