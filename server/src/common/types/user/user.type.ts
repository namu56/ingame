export const UserProvider = {
  LOCAL: 'local',
  GOOGLE: 'google',
  NAVER: 'naver',
  KAKAO: 'kakao',
} as const;
export type UserProvider = (typeof UserProvider)[keyof typeof UserProvider];
