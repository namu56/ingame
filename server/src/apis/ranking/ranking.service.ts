import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserInfoWithRankDto } from './dto/user-info-with-rank.dto';
import { LevelCalculatorService } from 'src/common/level-calculator/level-calculator.service';
import { PaginationRequestDto } from './dto/pagination-request.dto';
import { UserRankingByPageDto } from './dto/user-ranking-by-page.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import { UserRankingDto } from './dto/user-ranking.dto';

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
    const [usersInfo, total] = await this.usersService.getUsersWithRankByPage(page, limit);

    const ranking: UserRankingDto[] = usersInfo.map((userInfo) => {
      return this.toRankingResponse(userInfo);
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

  private toRankingResponse(userInfo: UserInfoWithRankDto): UserRankingDto {
    const level = this.levelCalculatorService.findLevel(userInfo.point).level;

    return {
      id: userInfo.id,
      nickname: userInfo.nickname,
      point: userInfo.point,
      rank: userInfo.rank,
      level,
    };
  }
}
