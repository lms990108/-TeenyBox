import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { ROLE, STATE, SOCIAL } from "../common/enum/enum";
import { Union } from "../common/enum/CustomUnion";

type Role = Union<typeof ROLE>;
type State = Union<typeof STATE>;
type Social = Union<typeof SOCIAL>;

export class UserRequestDTO {
  @IsString({ message: "고유 아이디는 문자열이어야 합니다." })
  @IsNotEmpty({ message: "고유 아이디는 반드시 입력되어야 합니다." })
  user_id: string;

  @IsEnum(SOCIAL, {
    message: "소셜 정보는 kakao, naver, google 중 하나로 입력되어야 합니다.",
  })
  @IsNotEmpty({ message: "소셜 정보는 반드시 입력되어야 합니다." })
  social_provider: Social;

  @IsString({ message: "닉네임은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "닉네임은 반드시 입력되어야 합니다." })
  nickname: string;

  @IsString({ message: "프로필 URL은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "프로필 URL은 반드시 입력되어야 합니다." })
  profile_url: string;

  @IsString({ message: "관심 지역은 문자열이어야 합니다." })
  @IsNotEmpty({ message: "관심 지역은 반드시 입력되어야 합니다." })
  interested_area: string;
}

export class UserResponseDTO {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsEnum(SOCIAL)
  @IsNotEmpty()
  social_provider: Social;

  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  profile_url: string;

  @IsString()
  @IsNotEmpty()
  interested_area: string;

  @IsEnum(ROLE)
  @IsNotEmpty()
  role: Role;

  @IsEnum(STATE)
  @IsNotEmpty()
  state: State;
}

export class KakaoUserDataDTO {
  @IsString()
  id: string;

  @IsString()
  profileUrl: string;

  @IsString()
  nickname: string;
}
