import { Union } from "./CustomUnion";

export const STATUS = {
  ONGOING: "공연중",
  FINISHED: "공연완료",
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

export enum REGION_NAME {
  서울,
  "경기/인천",
  부산,
  대구,
  광주,
  대전,
  울산,
  세종,
  강원,
  충청,
  전라,
  경상,
  제주,
}

export type StatusType = Union<typeof STATUS>;
export type RegionType = keyof typeof REGION_NAME;

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
