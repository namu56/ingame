import { PaginationResponseDto } from './pagination-response.dto';
import { UserRankingDto } from './user-ranking.dto';

export class UserRankingByPageDto {
  ranking: UserRankingDto[];
  pagination: PaginationResponseDto;
}
