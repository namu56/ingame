import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';

export const signup = http.post(`${API_END_POINT['SIGNUP']}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});
