import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  content: string;
  rate: number;
  userId: string;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const ReviewSchema = new Schema<IReview>({
  content: { type: String, required: true },
  rate: { type: Number, required: true, index: true },
  userId: { type: String, required: true },
  postId: { type: Number, required: true },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: { tyep: Date, nullabe: true },
});

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
