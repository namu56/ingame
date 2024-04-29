import { API_END_POINT } from '@/constant/api';
import { httpClient } from '@/utils/axios';

interface LoginInfo {
  email: string;
  password: string;
}

export const login = async (data: LoginInfo) => {
  const resposne = await httpClient.post(API_END_POINT.LOGIN, { ...data });
  return resposne.data;
};
