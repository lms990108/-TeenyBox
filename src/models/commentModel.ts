import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  user_id: string; // 추후에 user 로직이 완료되면 ref로 변경
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
      type: String,
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
