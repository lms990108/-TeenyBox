import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  post_number: number;
  user_id: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  comments: (typeof mongoose.Schema.Types.ObjectId)[];
}

const postSchema = new Schema<IPost>(
  {
    post_number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 'User'는 참조하고자 하는 모델의 이름입니다.
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true, // 검색기능을 위한 인덱싱
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

const PostModel = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
