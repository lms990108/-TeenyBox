import jwt from "jsonwebtoken";
import { UserModel, IUser } from "../../models/userModel";
import NotFoundError from "../error/NotFoundError";

const SECRET_KEY = process.env.SECRET_KEY as string;

// 액세스토큰 생성
export function generateToken(user: IUser): string {
  const payload = {
    user_id: user.user_id,
    social_provider: user.social_provider,
    nickname: user.nickname,
    interested_area: user.interested_area,
    role: user.role,
    state: user.state,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
}

// 리프레시토큰 생성
export function generateRefreshToken(user: IUser): string {
  const payload = {
    user_id: user.user_id,
    social_provider: user.social_provider,
    nickname: user.nickname,
    interested_area: user.interested_area,
    role: user.role,
    state: user.state,
  };
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "14d",
  });
  return refreshToken;
}

// 토큰 검증
export async function findByToken(
  token: string,
): Promise<{ foundUser: IUser | null; error: Error | null }> {
  try {
    const decode = jwt.verify(token, SECRET_KEY) as { user_id: string };
    const foundUser = await UserModel.findOne({ user_id: decode.user_id });
    if (!foundUser) {
      throw new NotFoundError("사용자를 찾을 수 없습니다.");
    }
    return { foundUser, error: null };
  } catch (err) {
    return { foundUser: null, error: err };
  }
}
