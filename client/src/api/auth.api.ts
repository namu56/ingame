import { API_END_POINT } from '@/constant/api';
import { LoginProps } from '@/pages/Login';
import { httpClient } from '@/utils/axios';

export const login = async (data: LoginProps) => {
  const resposne = await httpClient.post(API_END_POINT.LOGIN, { ...data });
  return resposne.data;
};

export const logout = async () => {
  const resposne = await httpClient.post(API_END_POINT.LOGOUT);
  return resposne.data;
};
