export const UserProvider = {
  Local: 'LOCAL',
  Google: 'GOOGLE',
  Naver: 'NAVER',
  Kakao: 'KAKAO',
} as const;
export type UserProvider = (typeof UserProvider)[keyof typeof UserProvider];
