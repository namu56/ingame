import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';

export const CreateQuest = http.post(`${API_END_POINT.CREATE_QUEST}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});
export const PatchQuest = http.patch(`${API_END_POINT.PATCH_QUEST}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});
