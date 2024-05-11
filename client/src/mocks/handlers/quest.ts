import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';

export const createQuest = http.post(`${API_END_POINT.CREATE_QUEST}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});
export const patchQuest = http.patch(`${API_END_POINT.PATCH_QUEST}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});
