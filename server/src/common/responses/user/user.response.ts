import { Expose, Transform } from 'class-transformer';

export class UserResponse {
  @Expose()
  readonly id: number;

  @Expose()
  readonly email: string;

  @Expose()
  @Transform(({ obj }) => obj.userInfo.nickname)
  readonly nickname: string;

  @Expose()
  @Transform(({ obj }) => obj.userInfo.intro)
  readonly intro: string | null;

  @Expose()
  @Transform(({ obj }) => obj.userInfo.point)
  readonly point: number;

  @Expose()
  @Transform(({ obj }) => obj.profilePhoto.profilePhotoUrl)
  readonly profilePhotoUrl: string | null;

  @Expose()
  readonly level: number;
}
