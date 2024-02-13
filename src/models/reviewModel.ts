import mongoose, {Schema, Document} from "mongoose";

export interface IReview extends Document {
  title: string;
  content: string;
  rate: number;
  imageUrls?: string[] | null;
  userId: string;
  userNickname: string;
  showId: string;
  showTitle: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const ReviewSchema = new Schema<IReview>({
  title: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return value.length >= 1 && value.length <= 30;
      },
      message: "리뷰 제목은 1~30자 사이여야 합니다.",
    },
  },
  content: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => {
        return value.length >= 1 && value.length <= 500;
      },
      message: "리뷰 내용은 1~500자 사이여야 합니다.",
    },
  },
  rate: {
    type: Number,
    required: true,
    enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
  },
  imageUrls: [{ type: String }],
  userId: { type: String, required: true },
  showId: { type: String, required: true },
  showTitle: { type: String, required: true },
  createdAt: { type: Date, index: true },
  updatedAt: Date,
  deletedAt: { type: Date, default: null },
});

ReviewSchema.index({ createdAt: -1, rate: -1 });

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
