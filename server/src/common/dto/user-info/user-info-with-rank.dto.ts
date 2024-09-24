import { Expose } from 'class-transformer';

export class UserInfoWithRankDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly nickname: string;

  @Expose()
  readonly point: number;

  @Expose()
  readonly rank: number;
}
