import { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import * as UserDto from "./../dtos/userDto";
import UserService from "../services/userService";
import {
  generateToken,
  generateRefreshToken,
} from "../common/utils/tokenUtils";
import { AuthRequest } from "../middlewares/authUserMiddlewares";

class UserController {
  async RegisterUser(req: Request, res: Response) {
    const { id, profileUrl, nickname } = JSON.parse(req.query.data as string);
    const socialProvider = req.query.provider as string;
    const createUserRequestDTO: UserDto.UserRequestDTO = req.body;
    const user = await UserService.register({
      createUserRequestDTO,
      id,
      profileUrl,
      nickname,
      socialProvider,
    });
    return res
      .status(201)
      .json({ message: "회원가입이 완료되었습니다.", user });
  }

  async checkNickname(req: Request, res: Response) {
    const { nickname } = req.body;
    await UserService.checkNickname(nickname);
    return res.status(200).json({ message: "사용 가능한 닉네임입니다." });
  }

  // 수정 필요
  async kakaoLogin(req: Request, res: Response) {
    const { authorizationCode } = req.body;
    const accessToken = await UserService.getKakaoToken(
      authorizationCode,
      process.env.KAKAO_REST_API_KEY,
    );
    const kakaoUserData = await UserService.getKakaoUserData(accessToken);
    const user = await UserModel.findOne({ user_id: kakaoUserData.id });
    if (user) {
      const token = await generateToken(user);
      const refreshToken = await generateRefreshToken(user);
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
      return res
        .status(302)
        .json({ message: "회원가입이 필요합니다." })
        .redirect(
          `/register?data=${JSON.stringify(kakaoUserData)}&provider=kakao`,
        );
    }
  }

  // 수정 필요
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
    const userId = req.user.user_id;
    const updateUserRequestDTO: UserDto.UserRequestDTO = req.body;
    const user = await UserService.updateUser(userId, updateUserRequestDTO);
    return res
      .status(200)
      .json({ message: "회원 정보가 수정되었습니다.", user });
  }

  async deleteUser(req: AuthRequest, res: Response) {
    const userId = req.user.user_id;
    await UserService.deleteUser(userId);
    return res.status(200).json({ message: "회원 탈퇴가 완료되었습니다." });
  }

  async getAllUsers(req: Request, res: Response) {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const users = await UserService.getAllUsers(page);
    return res.status(200).json({ users });
  }
}

export default new UserController();
