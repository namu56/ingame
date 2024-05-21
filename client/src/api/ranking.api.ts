import { API_END_POINT } from '@/constant/api';
import { RankingItem } from '@/models/ranking.model';
import { httpClient } from '@/utils/axios';

// interface GetRankingParams { 
//   pageParam: number;
//   rankingPerPage: number;
// }
// { pageParam, rankingPerPage }
// ?pageParam=${pageParam}&rankingPerPage=${rankingPerPage} query string값이고
// query parameter로 넘겨주는 값이다 { pageParam, rankingPerPage }

export const getRanking = async (): Promise<RankingItem[]> => {
  try {
    const response = await httpClient.get(API_END_POINT.RANK);
    return response.data;
  } catch (error) {
    throw error;
  }
};
