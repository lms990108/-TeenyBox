import { UserModel, IUser } from "../models/userModel";
import { UserRequestDTO, UserResponseDTO } from "../dtos/userDto";

class UserRepository {
  // 사용자 생성
  async createUser(userData: {
    user_id: string;
    social_provider: string;
    nickname: string;
    profile_url: string;
    interested_area: string;
    role: string;
    state: string;
  }): Promise<UserResponseDTO> {
    const existingUser = await UserModel.findOne({ user_id: userData.user_id });
    if (existingUser) {
      existingUser.social_provider = userData.social_provider;
      existingUser.nickname = userData.nickname;
      existingUser.profile_url = userData.profile_url;
      existingUser.interested_area = userData.interested_area;
      existingUser.role = userData.role;
      existingUser.state = userData.state;
      const createdUser = await existingUser.save();
      const userResponse: UserResponseDTO = {
        user_id: createdUser.user_id,
        social_provider: createdUser.social_provider as
          | "kakao"
          | "naver"
          | "google",
        nickname: createdUser.nickname,
        profile_url: createdUser.profile_url,
        interested_area: createdUser.interested_area,
        role: createdUser.role as "admin" | "user",
        state: createdUser.state as "가입" | "탈퇴",
      };
      return userResponse;
    } else {
      const user = new UserModel(userData);
      const createdUser = await user.save();
      const userResponse: UserResponseDTO = {
        user_id: createdUser.user_id,
        social_provider: createdUser.social_provider as
          | "kakao"
          | "naver"
          | "google",
        nickname: createdUser.nickname,
        profile_url: createdUser.profile_url,
        interested_area: createdUser.interested_area,
        role: createdUser.role as "admin" | "user",
        state: createdUser.state as "가입" | "탈퇴",
      };
      return userResponse;
    }
  }

  // 닉네임 중복 확인
  async getUserByNickname(nickname: string): Promise<IUser | null> {
    return await UserModel.findOne({ nickname });
  }

  // 회원정보 조회 (사용자 ID로)
  async getUserById(userId: string): Promise<UserResponseDTO | null> {
    return await UserModel.findOne({ user_id: userId });
  }

  // 회원정보 수정 (사용자 ID로)
  async updateUser(
    userId: string,
    updateUserRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO | null> {
    return await UserModel.findOneAndUpdate(
      { user_id: userId },
      updateUserRequestDTO,
      { new: true },
    );
  }

  // 회원정보 삭제 (stste '탈퇴'로 변경)
  async deleteUser(userId: string): Promise<UserResponseDTO | null> {
    return await UserModel.findOneAndUpdate(
      { user_id: userId },
      { state: "탈퇴" },
      { new: true },
    );
  }

  // 전체 회원 목록 조회
  async getUsers(skip: number, limit: number): Promise<UserResponseDTO[]> {
    const users = await UserModel.find().skip(skip).limit(limit);

    const userResponseDTOs = users.map((user) => ({
      user_id: user.user_id,
      social_provider: user.social_provider as "kakao" | "naver" | "google",
      nickname: user.nickname,
      profile_url: user.profile_url,
      interested_area: user.interested_area,
      role: user.role as "admin" | "user",
      state: user.state as "가입" | "탈퇴",
    }));
    return userResponseDTOs;
  }
}

export default new UserRepository();
