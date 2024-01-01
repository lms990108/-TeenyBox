import { Request, Response } from "express";
import * as UserDto from "./../dtos/userDto";
import UserService from "../services/userService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";

class UserController {
  async RegisterUser(req: Request, res: Response) {
    const createUserRequestDTO: UserDto.UserRequestDTO = req.body;
    const user = await UserService.register(createUserRequestDTO);
    return res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", user });
  }

  async checkNickname(req: Request, res: Response) {
    const { user_id, nickname } = req.body;
    await UserService.checkNickname(user_id, nickname);
    return res.status(200).json({ message: "사용 가능한 닉네임입니다." });
  }

  async kakaoLogin(req: Request, res: Response) {
    const { authorizationCode } = req.body;
    const { user, token, refreshToken, kakaoUserData } =
      await UserService.kakaoLogin(authorizationCode);
    if (user) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(200).json({ message: "로그인 되었습니다.", user });
    } else {
      return res.status(302).json({
        message: "회원가입이 필요합니다.",
        kakaoUserData,
        social_provider: "kakao",
      });
    }
  }

  async naverLogin(req: Request, res: Response) {
    const { authorizationCode, state } = req.body;
    const { user, token, refreshToken, naverUserData } =
      await UserService.naverLogin(authorizationCode, state);
    if (user) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(200).json({ message: "로그인 되었습니다.", user });
    } else {
      return res.status(302).json({
        message: "회원가입이 필요합니다.",
        naverUserData,
        social_provider: "naver",
      });
    }
  }

  async googleLogin(req: Request, res: Response) {
    const { authorizationCode } = req.body;
    const { user, token, refreshToken, googleUserData } =
      await UserService.googleLogin(authorizationCode);
    if (user) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      return res.status(200).json({ message: "로그인 되었습니다.", user });
    } else {
      return res.status(302).json({
        message: "회원가입이 필요합니다.",
        googleUserData,
        social_provider: "google",
      });
    }
  }

  async logout(req: Request, res: Response) {
    res.clearCookie("token"); // 쿠키 삭제
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "로그아웃 되었습니다." });
  }

  async getUser(req: AuthRequest, res: Response) {
    const userId: string = req.user.user_id;
    const user = await UserService.getUserById(userId);
    return res.status(200).json({ user });
  }

  async updateUser(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const updateUserRequestDTO: UserDto.UserRequestDTO = req.body;
    const user = await UserService.updateUser(userId, updateUserRequestDTO);
    return res
      .status(200)
      .json({ message: "회원 정보가 수정되었습니다.", user });
  }

  async deleteUser(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    await UserService.deleteUser(userId);
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  }

  async getBookmarks(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const bookmarks = await UserService.getBookmarks(userId, page, limit);
    return res.status(200).json({ bookmarks });
  }

  async isBookmarked(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const showId = req.params.showId as string;
    const isBookmarked = await UserService.isBookmarked(userId, showId);
    return res.status(200).json({ isBookmarked });
  }

  async saveShow(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const showId = req.params.showId as string;
    await UserService.saveShow(userId, showId);
    return res.status(200).json({ message: "공연 찜이 완료되었습니다." });
  }

  async cancelShow(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const showId = req.params.showId as string;
    await UserService.cancelShow(userId, showId);
    return res.status(200).json({ message: "공연 찜이 취소되었습니다." });
  }

  async cancelBookmarks(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const { showIds } = req.body;
    await UserService.cancelBookmarks(userId, showIds);
    return res.status(200).json({ message: "찜한 공연이 삭제되었습니다." });
  }

  async getAllUsers(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const users = await UserService.getAllUsers(page);
    return res.status(200).json({ users });
  }
}

export default new UserController();
