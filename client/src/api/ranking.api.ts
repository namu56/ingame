import { API_END_POINT } from '@/constant/api';
import { RankingItem } from '@/models/ranking.model';
import { httpClient } from '@/utils/axios';

// interface GetRankingParams { 
//   pageParam: number;
// }

export const getRanking = async (): Promise<RankingItem[]> => {
  try {
    const response = await httpClient.get(API_END_POINT.RANK);
    return response.data;
  } catch (error) {
    throw error;
  }
};
