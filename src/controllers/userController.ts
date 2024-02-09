import { Request, Response } from "express";
import { UserRequestDTO, UserResponseDTO } from "./../dtos/userDto";
import UserService from "../services/userService";
import { AuthRequest } from "../middlewares/authUserMiddlewares";

class UserController {
  async RegisterUser(req: Request, res: Response) {
    const createUserRequestDTO: UserRequestDTO = req.body;
    await UserService.register(createUserRequestDTO);
    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
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
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({ message: "로그인 되었습니다." });
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
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({ message: "로그인 되었습니다." });
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
        sameSite: "none",
        secure: true,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({ message: "로그인 되었습니다." });
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

    const userData: UserResponseDTO = {
      _id: user._id,
      user_id: user.user_id,
      social_provider: user.social_provider,
      nickname: user.nickname,
      profile_url: user.profile_url,
      interested_area: user.interested_area,
      role: user.role,
    };
    return res.status(200).json({ user: userData });
  }

  async updateUser(req: AuthRequest, res: Response) {
    const userId = req.user._id;
    const updateUserRequestDTO: UserRequestDTO = req.body;
    await UserService.updateUser(userId, updateUserRequestDTO);
    return res.status(200).json({ message: "회원 정보가 수정되었습니다." });
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
    const { users, totalUsers } = await UserService.getAllUsers(page);
    return res.status(200).json({ users, totalUsers });
  }

  async deleteUsers(req: Request, res: Response) {
    const { userIds } = req.body;
    await UserService.deleteUsers(userIds);
    return res
      .status(200)
      .json({ message: "선택한 회원의 탈퇴가 완료되었습니다." });
  }
}

export default new UserController();
