import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  title: string;
  content: string;
  rate: number;
  imageUrls?: string[] | null;
  userId: string;
  showId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const ReviewSchema = new Schema<IReview>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  rate: { type: Number, required: true, index: true },
  imageUrls: [{ type: String }],
  userId: { type: String, required: true },
  showId: { type: String, required: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: { type: Date, default: null },
});

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
