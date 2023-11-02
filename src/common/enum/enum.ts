export const STATUS = {
  ONGOING: "공연중",
  FINISHED: "공연종료",
  NOT_YET: "공연예정",
} as const;

export const REGION = {
  서울: 11,
  부산: 26,
  대구: 27,
  인천: 28,
  광주: 29,
  대전: 30,
  울산: 31,
  세종: 36,
  경기: 41,
  충북: 43,
  충남: 44,
  전북: 45,
  전남: 46,
  경북: 47,
  경남: 48,
  제주: 50,
  강원: 51,
} as const;

export const ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const STATE = {
  JOINED: "가입",
  WITHDRAWN: "탈퇴",
} as const;

export const SOCIAL = {
  KAKAO: "kakao",
  NAVER: "naver",
  GOOGLE: "google",
} as const;
