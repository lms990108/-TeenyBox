import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  user_id: string;
  social_provider: string;
  nickname: string;
  profile_url: string;
  interested_area: string;
  role: string;
  state: string;
  dibs: string[] | null;
  post: mongoose.Types.ObjectId[] | null;
  promotion: mongoose.Types.ObjectId[] | null;
  comment: mongoose.Types.ObjectId[] | null;
  review: mongoose.Types.ObjectId[] | null;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date | null;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
    },
    social_provider: {
      type: String,
      required: true,
      enum: ["kakao", "naver", "google"],
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    profile_url: {
      type: String,
      required: true,
    },
    interested_area: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },
    state: {
      type: String,
      enum: ["가입", "탈퇴"],
      required: true,
      default: "가입",
    },
    dibs: [
      {
        type: String,
      },
    ],
    post: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    promotion: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Promotion",
      },
    ],
    comment: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    review: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
