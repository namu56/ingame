import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockSubQuest } from '../data/mockSubQuest';
import { Quest, SubQuest } from '@/models/quest.model';
import { mockMainQuests } from '../data/mockMainQuest';

export const createMainQuest = http.post(`${API_END_POINT.CREATE_QUEST}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});

export const modiMainQuest = http.patch(`${API_END_POINT.PATCH_QUEST}/:id`, async ({ request, params}) => {
  const data = (await request.json()) as Omit<Quest, 'status'>;
  mockMainQuests.map((quest) => {
    if (quest.id === Number(params.id)) {
      quest.title = data.title;
    }
  })
  return new HttpResponse(JSON.stringify(mockMainQuests), { status: 200, statusText: `success` });
});

export const getSubQuest = http.get(`${API_END_POINT.SUB_QUEST}`, async (date) => {
  return new HttpResponse(JSON.stringify(mockSubQuest), { status: 200, statusText: `success` });
});

export const modiSubQuest = http.patch(
  `${API_END_POINT.SUB_QUEST}/:id`,
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
