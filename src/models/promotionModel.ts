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
  },
  {
    timestamps: true,
  },
);

const PromotionModel = mongoose.model<IPromotion>("Promotion", promotionSchema);

export default PromotionModel;
