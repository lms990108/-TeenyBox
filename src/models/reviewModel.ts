import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  title: string;
  content: string;
  rate: number;
  imageUrls?: string[] | null;
  userId: string;
  showId: string;
  userNickname: string;
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
      message: "제목은 1에서 30자 사이어야 합니다.",
    },
  },
  content: { type: String, required: true },
  rate: {
    type: Number,
    required: true,
    enum: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
  },
  imageUrls: [{ type: String }],
  userId: { type: String, required: true },
  showId: { type: String, required: true },
  userNickname: { type: String, required: true },
  showTitle: { type: String, required: true },
  createdAt: { type: Date, index: true },
  updatedAt: Date,
  deletedAt: { type: Date, default: null },
});

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
