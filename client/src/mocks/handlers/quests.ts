import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockSubQuest } from '../data/mockSubQuest';
import { SubQuest } from '@/models/quest.model';

export const getSubQuest = http.get(`${API_END_POINT['SUB_QUEST']}`, async (date) => {
  return new HttpResponse(JSON.stringify(mockSubQuest), { status: 200, statusText: `success` });
});

export const modiSubQuest = http.patch(
  `${API_END_POINT['SUB_QUEST']}/:id`,
  async ({ request, params }) => {
    const data = (await request.json()) as Omit<SubQuest, 'status'>;
    mockSubQuest.map((quest) => {
      if (quest.id === Number(params.id)) {
        quest.title = data.title;
      }
    });
    return new HttpResponse(JSON.stringify(mockSubQuest), { status: 200, statusText: `success` });
  }
);
