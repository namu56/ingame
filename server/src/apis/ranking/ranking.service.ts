import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RankingResponseDto } from './dto/ranking-response.dto';

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

      const rankedUser = new RankingResponseDto(user, currentRank);

      lastUserPoint = user.point;
      return rankedUser;
    });
    return ranking;
  }
}
