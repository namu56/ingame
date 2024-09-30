export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  intro: string | null;
  profilePhoto: string;
  point: number;
  level: number;
  levelProgress: number;
}
