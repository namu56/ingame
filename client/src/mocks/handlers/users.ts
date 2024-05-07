import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockUserInfo } from '../data/mockUser';

export const signup = http.post(`${API_END_POINT['SIGNUP']}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});

export const getUserInfo = http.get(`${API_END_POINT.GET_USERINFO}`, async () => {
  return new HttpResponse(
    JSON.stringify({
      ...mockUserInfo,
    }),
    {
      status: 200,
      statusText: 'OK',
    }
  );
});
