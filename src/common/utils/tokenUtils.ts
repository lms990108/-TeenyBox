import "dotenv/config";
import jwt from "jsonwebtoken";
import { IUser, UserModel } from "../../models/userModel";

const SECRET_KEY = process.env.SECRET_KEY as string;

// 액세스토큰 생성
export function generateToken(user: IUser): string {
  const payload = {
    _id: user._id,
    user_id: user.user_id,
    nickname: user.nickname,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "3600000", // 1시간
  });
  return token;
}

// 리프레시토큰 생성
export function generateRefreshToken(user: IUser): string {
  const payload = {
    _id: user._id,
    user_id: user.user_id,
    nickname: user.nickname,
  };
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1209600000", // 14일
  });
  return refreshToken;
}

// 토큰 검증
export async function findByToken(token: string): Promise<IUser | null> {
  try {
    const decode = jwt.verify(token, SECRET_KEY) as { user_id: string };
    const foundUser = await UserModel.findOne({ user_id: decode.user_id });
    return foundUser;
  } catch (err) {
    if (err.message === "jwt expired") {
      return null;
    }
  }
}
