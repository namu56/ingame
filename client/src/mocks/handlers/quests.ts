import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockSubQuest } from '../data/mockSubQuest';

export const getSubQuest = http.get(`${API_END_POINT['GET_SUB_QUEST']}`, async (date) => {
  return new HttpResponse(
    JSON.stringify({
      quest: [...mockSubQuest],
    }),
    { status: 200, statusText: `success` }
  );
});
