import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockRankingProfiles } from '@/mocks/data/mockRanking';

export const getRanking = http.get(`${API_END_POINT.RANK}`, async ({ request }) => {
  const url = new URL(request.url);
  const pageNum = Number(url.searchParams.get('pageParam'));
  const perPage = Number(url.searchParams.get('recruitmentsPerPage'));
  const filteredRecruitmentsMockData = mockRankingProfiles.filter((_, index) => index % 2 === 0);

  return new HttpResponse(
    JSON.stringify({
      ranking: filteredRecruitmentsMockData.slice(pageNum * perPage, (pageNum + 1) * perPage),
      pageNum: pageNum + 1,
      isLastPage: filteredRecruitmentsMockData.length <= (pageNum + 1) * perPage,
      message: 'Success',
    }),
    {
      status: 200,
      statusText: 'OK',
    },);
});
