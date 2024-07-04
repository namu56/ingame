import { RankingDto } from '@common/dto/ranking';
import { PaginationResponse } from '../pagination';

export class RankingResponse {
  constructor(
    readonly rankings: RankingDto[],
    readonly pagination: PaginationResponse
  ) {}
}
