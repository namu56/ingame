import { RankingDto } from '@common/dto/ranking';
import { PaginationResponse } from '../pagination';
import { Expose } from 'class-transformer';

export class RankingResponse {
  @Expose()
  readonly rankings: RankingDto[];

  @Expose()
  readonly pagination: PaginationResponse;
}
