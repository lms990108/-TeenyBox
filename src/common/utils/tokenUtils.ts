import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models/userModel";
import { UserResponseDTO } from "../../dtos/userDto";
import { SocialProvider } from "../../batch/types/SocialLogin";

const SECRET_KEY = process.env.SECRET_KEY as string;

// 액세스토큰 생성
export function generateToken(user: UserResponseDTO): string {
  const payload = {
    _id: user._id,
    user_id: user.user_id,
    nickname: user.nickname,
  };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
}

// 리프레시토큰 생성
export function generateRefreshToken(user: UserResponseDTO): string {
  const payload = {
    _id: user._id,
    user_id: user.user_id,
    nickname: user.nickname,
  };
  const refreshToken = jwt.sign(payload, SECRET_KEY, {
    expiresIn: "14d",
  });
  return refreshToken;
}

// 토큰 검증
export async function findByToken(
  token: string,
): Promise<UserResponseDTO | null> {
  try {
    const decode = jwt.verify(token, SECRET_KEY) as { user_id: string };
    const foundUser = await UserModel.findOne({ user_id: decode.user_id });
    const userResponse: UserResponseDTO = {
      _id: foundUser._id,
      user_id: foundUser.user_id,
      social_provider: foundUser.social_provider as SocialProvider,
      nickname: foundUser.nickname,
      profile_url: foundUser.profile_url,
      interested_area: foundUser.interested_area,
      role: foundUser.role as "admin" | "user",
      state: foundUser.state as "가입" | "탈퇴",
    };

    return userResponse;
  } catch (err) {
    if (err.message === "jwt expired") {
      return null;
    }
  }
}
