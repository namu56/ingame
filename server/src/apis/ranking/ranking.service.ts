import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RankingResponseDto } from './dto/ranking-response.dto';
import { UserInfo } from '../users/entities/user-info.entity';

@Injectable()
export class RankingService {
  constructor(private readonly usersService: UsersService) {}
  async getRanking(): Promise<RankingResponseDto[]> {
    const users = await this.usersService.getAllUser();
    let currentRank = 1;
    let lastUserPoint = 0;
    let countCurrentRank = 0;

    const ranking = users.map((user) => {
      if (user.point !== lastUserPoint) {
        currentRank += countCurrentRank;
        countCurrentRank = 1;
      } else {
        countCurrentRank++;
      }

      const rankedUser = this.toRankingResponse(user, currentRank);

      lastUserPoint = user.point;
      return rankedUser;
    });
    return ranking;
  }

  private toRankingResponse(userInfo: UserInfo, rank: number): RankingResponseDto {
    return {
      id: userInfo.userId,
      nickname: userInfo.nickname,
      point: userInfo.point,
      rank: rank,
    };
  }
}
