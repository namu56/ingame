import { UserInfo } from 'src/apis/users/entities/user-info.entity';

export class RankingResponseDto {
  id: number;
  nickname: string;
  point: number;
  rank: number;

  constructor(userInfo: UserInfo, rank: number) {
    this.id = userInfo.userId;
    this.nickname = userInfo.nickname;
    this.point = userInfo.point;
    this.rank = rank;
  }
}
