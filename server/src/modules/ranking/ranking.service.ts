import { Inject, Injectable } from '@nestjs/common';
import { LevelCalculatorService } from 'src/core/level-calculator/level-calculator.service';
import {
  IUserInfoRepository,
  USER_INFO_REPOSITORY_KEY,
} from 'src/entities/user-info/user-info-repository.interface';
import { IRankingService } from './interfaces/ranking-service.interface';
import { RankingDto } from '@common/dto/ranking';
import { PaginationRequest } from '@common/requests/pagination';
import { PaginationResponse } from '@common/responses/pagination';
import { RankingResponse } from '@common/responses/ranking';

@Injectable()
export class RankingService implements IRankingService {
  constructor(
    @Inject(USER_INFO_REPOSITORY_KEY) private readonly userInfoRepository: IUserInfoRepository,
    private levelCalculatorService: LevelCalculatorService
  ) {}
  async getRankingByPage(paginationRequest: PaginationRequest): Promise<RankingResponse> {
    const { page, limit } = paginationRequest;
    const offset = (page - 1) * limit;

    const userInfos = await this.userInfoRepository.getRanking(offset, limit);
    const total = await this.userInfoRepository.getTotalCount();

    const pagination = new PaginationResponse(Math.ceil(total / limit), page + 1);
    const rankings = userInfos.map((userInfo) => {
      const level = this.levelCalculatorService.findLevel(userInfo.point).level;
      return new RankingDto(userInfo, level);
    });

    return new RankingResponse(rankings, pagination);
  }
}
