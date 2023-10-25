import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  title: string;
  content: string;
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    title: {
      type: String,
      required: true,
    },
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
