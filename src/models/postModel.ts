import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  post_number: number;
  user_id: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  comments: (typeof mongoose.Schema.Types.ObjectId)[];
  likes: number; // 추천수
  views: number; // 조회수
  likedUsers: string[]; // 추천한 사용자의 ID 목록
  deletedAt?: Date | null; // 삭제로직 변경을 위한 필드 추가
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
    tags: {
      type: [String],
    },
    likes: {
      type: Number,
      required: true,
      default: 0, // 기본값을 0으로 설정
    },
    views: {
      type: Number,
      required: true,
      default: 0, // 기본값을 0으로 설정
    },
    likedUsers: {
      type: [String],
      ref: "User",
      required: true,
      default: [],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const PostModel = mongoose.model<IPost>("Post", postSchema);

export default PostModel;
