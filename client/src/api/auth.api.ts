import { API_END_POINT } from '@/constant/api';
import { LoginProps } from '@/pages/Login';
import { httpClient } from '@/utils/axios';

export const login = async (data: LoginProps) => {
  const response = await httpClient.post(API_END_POINT.LOGIN, { ...data });
  return response.data;
};

export const logout = async () => {
  const response = await httpClient.post(API_END_POINT.LOGOUT);
  return response.data;
};

export const refreshToken = async () => {
  const response = await httpClient.post(API_END_POINT.REFRESH_TOKEN);
  return response.data;
};
