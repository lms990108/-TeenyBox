import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  content: string;
  rate: number;
  userId: string;
  showId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const ReviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  rate: { type: Number, required: true, index: true },
  userId: { type: String, required: true },
  showId: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: { type: Date, default: null },
});

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
