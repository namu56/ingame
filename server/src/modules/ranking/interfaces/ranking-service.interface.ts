import { RankingResponse } from '@common/responses/ranking';
import { PaginationRequest } from 'src/common/requests/pagination/pagination.request';

export const RANKING_SERVICE_KEY = 'rankingServiceKey';

export interface IRankingService {
  getRankingByPage(paginationRequest: PaginationRequest): Promise<RankingResponse>;
}
