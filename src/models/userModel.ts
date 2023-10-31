import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  user_id: string;
  alias: string;
  profile_url: string;
  interested_area: string;
  dibs: mongoose.Types.ObjectId | null;
  role: string;
  state: string;
}

const UserSchema: Schema = new Schema({
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
  alias: {
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
  dibs: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Show",
    },
  ],
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
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
