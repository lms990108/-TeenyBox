import { UserModel, IUser } from "../models/userModel";
import { ShowModel } from "../models/showModel";
import { UserRequestDTO, UserResponseDTO } from "../dtos/userDto";
import { SocialProvider } from "../batch/types/SocialLogin";

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
        _id: createdUser._id,
        user_id: createdUser.user_id,
        social_provider: createdUser.social_provider as SocialProvider,
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
        _id: createdUser._id,
        user_id: createdUser.user_id,
        social_provider: createdUser.social_provider as SocialProvider,
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

  // 회원정보 조회 (소셜 고유 ID)
  async getUserById(userId: string): Promise<UserResponseDTO | null> {
    return await UserModel.findOne({ user_id: userId });
  }

  // 회원정보 수정
  async updateUser(
    userId: string,
    updateUserRequestDTO: UserRequestDTO,
  ): Promise<UserResponseDTO | null> {
    return await UserModel.findByIdAndUpdate(userId, updateUserRequestDTO, {
      new: true,
    });
  }

  // 회원정보 삭제 (state '탈퇴'로 변경, 탈퇴일 추가)
  async deleteUser(userId: string): Promise<void> {
    return await UserModel.findByIdAndUpdate(userId, {
      state: "탈퇴",
      deletedAt: new Date(),
    });
  }

  // 유저 찜 목록
  async getBookmarks(userId: string, page: number, limit: number) {
    const user = await UserModel.findById(userId);

    const bookmarks = await Promise.all(
      user.dibs.slice((page - 1) * limit, page * limit).map(async (showId) => {
        const show = await ShowModel.findOne({ showId });
        if (show) {
          return {
            showId: show.showId,
            title: show.title,
            poster: show.poster,
            region: show.region,
            company: show.company,
          };
        } else {
          return showId;
        }
      }),
    );

    const validBookmarks = bookmarks
      .filter((bookmark) => bookmark !== null)
      .reverse();

    return validBookmarks;
  }

  // 찜 여부
  async isBookmarked(userId: string, showId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);

    const isBookmarked = user.dibs.includes(showId);

    return isBookmarked;
  }

  // 찜 추가(공연 상세 페이지)
  async saveShow(userId: string, showId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $addToSet: { dibs: showId } });
  }

  // 찜 취소(공연 상세 페이지)
  async cancelShow(userId: string, showId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, { $pull: { dibs: showId } });
  }

  // 찜 취소(유저 찜 목록)
  async cancelBookmarks(userId: string, showIds: string[]): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { dibs: { $in: showIds } },
    });
  }

  // 전체 회원 목록 조회
  async getUsers(skip: number, limit: number): Promise<UserResponseDTO[]> {
    const users = await UserModel.find().skip(skip).limit(limit);

    const userResponseDTOs = users.map((user) => ({
      _id: user._id,
      user_id: user.user_id,
      social_provider: user.social_provider as SocialProvider,
      nickname: user.nickname,
      profile_url: user.profile_url,
      interested_area: user.interested_area,
      role: user.role as "admin" | "user",
      state: user.state as "가입" | "탈퇴",
      created_at: user.createdAt,
      update_at: user.updatedAt,
      deleted_at: user.deletedAt,
    }));
    return userResponseDTOs;
  }
}

export default new UserRepository();
