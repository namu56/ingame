import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockRankingProfiles } from '@/mocks/data/mockRanking';

export const getRanking = http.get(`${API_END_POINT['RANK']}`, async () => {
  return new HttpResponse(
    JSON.stringify({
      ranking: [...mockRankingProfiles]
    }),
    {
      status: 200,
      statusText: 'OK',
    },);
});
