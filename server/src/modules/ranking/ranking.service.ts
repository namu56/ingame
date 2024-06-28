import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserInfoWithRankDto } from '../../common/dto/ranking/user-info-with-rank.dto';
import { LevelCalculatorService } from 'src/core/level-calculator/level-calculator.service';
import { PaginationRequestDto } from '../../common/dto/ranking/pagination-request.dto';
import { UserRankingByPageDto } from '../../common/dto/ranking/user-ranking-by-page.dto';
import { PaginationResponseDto } from '../../common/dto/ranking/pagination-response.dto';
import { UserRankingDto } from '../../common/dto/ranking/user-ranking.dto';
import { IUserService, USER_SERVICE_KEY } from '../user/interfaces/user-service.interface';

@Injectable()
export class RankingService {
  constructor(
    @Inject(USER_SERVICE_KEY) private readonly userService: IUserService,
    private levelCalculatorService: LevelCalculatorService
  ) {}
  // async getRankingByPage(
  //   paginationRequestDto: PaginationRequestDto
  // ): Promise<UserRankingByPageDto> {
  //   const { page, limit } = paginationRequestDto;
  //   const [usersInfo, total] = await this.userService.getUsersWithRankByPage(page, limit);

  //   const ranking: UserRankingDto[] = usersInfo.map((userInfo) => {
  //     return this.toRankingResponse(userInfo);
  //   });

  //   const pagination: PaginationResponseDto = {
  //     totalPage: Math.ceil(total / limit),
  //     nextPage: page + 1,
  //   };

  //   const rankingByPage: UserRankingByPageDto = {
  //     ranking,
  //     pagination,
  //   };

  //   return rankingByPage;
  // }

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
