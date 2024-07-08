import { UserInfoWithRankDto } from '../user-info';

export class RankingDto {
  readonly id: number;
  readonly nickname: string;
  readonly point: number;
  readonly rank: number;
  readonly level: number;

  constructor(userInfo: UserInfoWithRankDto, level: number) {
    this.id = userInfo.id;
    this.nickname = userInfo.nickname;
    this.point = userInfo.point;
    this.rank = userInfo.rank;
    this.level = level;
  }
}
