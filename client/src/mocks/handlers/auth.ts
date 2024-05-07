import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';

export const login = http.post(`${API_END_POINT['LOGIN']}`, async () => {
  return new HttpResponse(
    JSON.stringify({
      accessToken: 'token',
    })
  );
});

export const logout = http.post(`${API_END_POINT['LOGOUT']}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 200, message: 'success' }));
});
