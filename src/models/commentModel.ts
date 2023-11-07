import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  user_id: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  promotion: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    promotion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promotion",
    },
  },
  {
    timestamps: true,
  },
);

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
