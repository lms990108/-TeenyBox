import mongoose, { Document, Schema } from "mongoose";

export interface IPromotion extends Document {
  promotion_number: number;
  user_id: string;
  title: string;
  content: string;
  poster_image: string; // Image 모델을 참조합니다.
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
    poster_image: {
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
