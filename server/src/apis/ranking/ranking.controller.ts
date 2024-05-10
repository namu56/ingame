import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { UserRankingDto } from './dto/ranking-response.dto';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('ranking')
@ApiTags('Ranking API')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: '랭킹 조회' })
  @ApiOkResponse({ type: UserRankingDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  findAllRanking(): Promise<UserRankingDto[]> {
    return this.rankingService.getRanking();
  }
}
