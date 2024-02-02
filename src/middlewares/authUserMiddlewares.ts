import { Request, Response, NextFunction } from "express";
import { generateToken, findByToken } from "../common/utils/tokenUtils";
import ForbiddenError from "../common/error/ForbiddenError";
import UnauthorizedError from "../common/error/UnauthorizedError";
import { IUser } from "../models/userModel";

// 사용자 정의 속성을 추가한 요청 객체 타입 확장
export interface AuthRequest extends Request {
  isLoggedIn: boolean;
  user: IUser | null;
}

// 사용자 인증 미들웨어
export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 헤더에서 액세스 토큰 추출
    const accessToken = req.cookies.token as string;
    if (!accessToken) {
      throw new ForbiddenError("로그인한 유저만 사용할 수 있는 서비스입니다.");
    }
    // 액세스 토큰 검증
    const foundUser = await findByToken(accessToken);
    if (!foundUser) {
      // 액세스 토큰이 만료된 경우 리프레시 토큰 검증(유효하다면 액세스 토큰 재발급)
      const refreshToken = req.cookies.refreshToken as string;
      if (!refreshToken) {
        throw new UnauthorizedError("인증되지 않은 사용자입니다.");
      }
      const refreshUser = await findByToken(refreshToken);
      if (!refreshUser) {
        throw new ForbiddenError("새로 로그인해야 합니다.");
      }
      // 새로운 액세스 토큰 생성 후 쿠키에 저장
      const newAccessToken = generateToken(refreshUser);
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      req.user = refreshUser;
    } else {
      // 액세스 토큰이 유효한 경우 사용자 정보 추가
      req.user = foundUser;
    }
    next();
  } catch (err) {
    next(err);
  }
};

// 관리자 인증 미들웨어
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 헤더에서 액세스 토큰 추출
    const accessToken = req.cookies.token as string;
    if (!accessToken) {
      throw new ForbiddenError("로그인한 유저만 사용할 수 있는 서비스입니다.");
    }
    // 액세스 토큰 검증
    const foundUser = await findByToken(accessToken);
    if (!foundUser) {
      // 액세스 토큰이 만료된 경우 리프레시 토큰 검증(유효하다면 액세스 토큰 재발급)
      const refreshToken = req.cookies.refreshToken as string;
      if (!refreshToken) {
        throw new UnauthorizedError("인증되지 않은 사용자입니다.");
      }
      const refreshUser = await findByToken(refreshToken);
      if (!refreshUser) {
        throw new ForbiddenError("새로 로그인해야 합니다.");
      }
      // 새로운 액세스 토큰 생성 후 쿠키에 저장
      const newAccessToken = generateToken(refreshUser);
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      req.user = refreshUser;
    } else {
      // 액세스 토큰이 유효한 경우 사용자 정보 추가
      req.user = foundUser;
    }
    // 관리자 검증
    if (foundUser.role !== "admin") {
      throw new ForbiddenError("관리자 권한이 필요합니다.");
    }
    next();
  } catch (err) {
    next(err);
  }
};
