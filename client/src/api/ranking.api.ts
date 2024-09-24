import { API_END_POINT } from '@/constant/api';
import { RankingResponse } from '@/models/ranking.model';
import { httpClient } from '@/utils/axios';

interface GetRankingParams {
  totalPage: number;
}

export const getRanking = async ({ totalPage }: GetRankingParams): Promise<RankingResponse> => {
  try {
    const response = await httpClient.get(`${API_END_POINT.RANK}?page=${totalPage}&limit=${10}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
