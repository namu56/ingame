import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RankingService } from './ranking.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationRequestDto } from '../../common/dto/ranking/pagination-request.dto';
import { UserRankingByPageDto } from '../../common/dto/ranking/user-ranking-by-page.dto';

@Controller('ranking')
@ApiTags('Ranking API')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  @ApiOperation({ summary: '랭킹 조회' })
  @ApiOkResponse({ type: UserRankingByPageDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @HttpCode(HttpStatus.OK)
  @UsePipes(
    new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } })
  )
  findRankingByPage(@Query() paginationRequestDto: PaginationRequestDto) {
    // return this.rankingService.getRankingByPage(paginationRequestDto);
  }
}
