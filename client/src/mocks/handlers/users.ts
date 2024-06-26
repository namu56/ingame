import { http, HttpResponse } from 'msw';
import { API_END_POINT } from '@/constant/api';
import { mockUserInfo } from '../data/mockUser';

export const signup = http.post(`${API_END_POINT.SIGNUP}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'created', message: 'success' }));
});

export const getUserInfo = http.get(`${API_END_POINT.USERINFO}`, async () => {
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

export const patchUserProfilePhoto = http.patch(`${API_END_POINT.PATCH_PROFILEPHOTO}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'updated', message: 'success' }));
});

export const patchUserProfile = http.patch(`${API_END_POINT.USERINFO}`, async () => {
  return new HttpResponse(JSON.stringify({ status: 'updated', message: 'success' }));
});
