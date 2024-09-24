import { Controller, Get, HttpCode, HttpStatus, Inject, Query } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationRequest } from 'src/common/requests/pagination/pagination.request';
import { IRankingService, RANKING_SERVICE_KEY } from './interfaces/ranking-service.interface';
import { RankingResponse } from '@common/responses/ranking';

@Controller('ranking')
@ApiTags('Ranking API')
export class RankingController {
  constructor(@Inject(RANKING_SERVICE_KEY) private readonly rankingService: IRankingService) {}

  @Get()
  @ApiOperation({ summary: '랭킹 조회' })
  @ApiOkResponse({ type: RankingResponse, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  findRankingByPage(@Query() request: PaginationRequest): Promise<RankingResponse> {
    return this.rankingService.getRankingByPage(request);
  }
}
