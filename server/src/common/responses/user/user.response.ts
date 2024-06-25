import { User } from 'src/entities/user/user.entity';

export class UserResponse {
  constructor(user: User, level: number) {
    this.id = user.id;
    this.email = user.email;
    this.nickname = user.userInfo.nickname;
    this.intro = user.userInfo.intro;
    this.point = user.userInfo.point;
    this.profilePhotoUrl = user.profilePhoto.profilePhotoUrl;
    this.level = level;
  }
  readonly id: number;
  readonly email: string;
  readonly nickname: string;
  readonly intro: string | null;
  readonly point: number;
  readonly profilePhotoUrl: string | null;
  readonly level: number;
}
