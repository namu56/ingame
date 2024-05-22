import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserRankingDto } from './dto/user-ranking.dto';
import { UserInfo } from '../users/entities/user-info.entity';
import { LevelCalculatorService } from 'src/common/level-calculator/level-calculator.service';
import { PaginationRequestDto } from './dto/pagination-request.dto';
import { UserRankingByPageDto } from './dto/user-ranking-by-page.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';

@Injectable()
export class RankingService {
  constructor(
    private readonly usersService: UsersService,
    private levelCalculatorService: LevelCalculatorService
  ) {}
  async getRankingByPage(
    paginationRequestDto: PaginationRequestDto
  ): Promise<UserRankingByPageDto> {
    const { page, limit } = paginationRequestDto;
    const [users, total] = await this.usersService.getAllUserByPage(page, limit);
    let currentRank = 1;
    let lastUserPoint = 0;
    let countCurrentRank = 0;

    const ranking: UserRankingDto[] = users.map((user) => {
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

    const pagination: PaginationResponseDto = {
      totalPage: Math.ceil(total / limit),
      nextPage: page + 1,
    };

    const rankingByPage: UserRankingByPageDto = {
      ranking,
      pagination,
    };

    return rankingByPage;
  }

  private toRankingResponse(userInfo: UserInfo, rank: number): UserRankingDto {
    const level = this.levelCalculatorService.findLevel(userInfo.point).level;

    return {
      id: userInfo.userId,
      nickname: userInfo.nickname,
      point: userInfo.point,
      rank: rank,
      level,
    };
  }
}
