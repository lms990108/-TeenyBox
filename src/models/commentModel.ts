import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  content: string;
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
