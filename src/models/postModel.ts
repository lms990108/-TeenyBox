import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  post_number: number;
  type: number;
  photo_url: string;
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
    type: {
      type: Number,
      required: true,
    },
    photo_url: {
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
