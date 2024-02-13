import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: string;
  user: IUser;
  post: mongoose.Schema.Types.ObjectId;
  promotion: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  nickname: string;
  profile_url: string;
  state: string;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    versionKey: false,
  },
);

const CommentModel = mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
