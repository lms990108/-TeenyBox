import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  post_number: number;
  user_id: string; // 일단 string으로 생성 후 나중에 user 로직 끝나면 ref
  type: number;
  photo_url: string;
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
    },
    user_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment", // This should match the model name you use for comments
      },
    ],
  },
  {
    timestamps: true, // This will create the createdAt and updatedAt fields
  },
);

const PostModel = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
