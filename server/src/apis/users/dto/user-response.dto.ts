import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  email: string;
  nickname: string;
  intro: string | null;
  profilePhoto: string | null;
  point: number | null;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.nickname = user.userInfo.nickname;
    this.intro = user.userInfo.intro || null;
    this.profilePhoto = user.profilePhoto.profilePhoto || null;
    this.point = user.userInfo.point || null;
  }
}
