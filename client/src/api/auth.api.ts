import { API_END_POINT } from '@/constant/api';
import { LoginProps } from '@/pages/Login';
import { httpClient } from '@/utils/axios';

interface LoginResponse {
  accessToken: string;
}
export const login = async (data: LoginProps) => {
  const resposne = await httpClient.post<LoginResponse>(API_END_POINT.LOGIN, { ...data });
  return resposne.data;
};
