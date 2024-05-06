export interface User {
  id: number;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: number;
  nickname: string;
  intro: string;
}