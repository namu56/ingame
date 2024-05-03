import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';

export const login = http.post(`${API_END_POINT['LOGIN']}`, async () => {
  return new HttpResponse(JSON.stringify({ token: '토큰값텍스트' }));
});
