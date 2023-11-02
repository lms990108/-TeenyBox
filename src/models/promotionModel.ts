import mongoose, { Document, Schema } from "mongoose";

export interface IPromotion extends Document {
  promotion_number: number;
  user_id: string; // 일단 string으로 생성 후 나중에 user 로직 끝나면 ref
  title: string;
  content: string;
  poster_url: string;
  createdAt?: Date;
  updatedAt?: Date;
  comments: (typeof mongoose.Schema.Types.ObjectId)[];
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
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    poster_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const PromotionModel = mongoose.model<IPromotion>("Promotion", promotionSchema);

export default PromotionModel;
