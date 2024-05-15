import { API_END_POINT } from '@/constant/api';
import { RankingItem } from '@/models/ranking.model';
import { httpClient } from '@/utils/axios';

export const getRanking = async (): Promise<RankingItem[]> => {
  const response = await httpClient.get(API_END_POINT.RANK);
  return response.data.ranking as RankingItem[];
};
