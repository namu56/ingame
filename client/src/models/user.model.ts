export interface User {
  id: number;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  nickname: string;
  intro: string;
}

export interface ProfilePhoto {
  profilePhoto: string | null;
}
