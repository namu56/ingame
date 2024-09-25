import { API_END_POINT } from '@/constant/api';
import { LoginProps } from '@/pages/Login';
import { httpClient } from '@/utils/axios';

interface Token {
  accessToken: string;
}

export const login = async (data: LoginProps): Promise<Token> => {
  const response = await httpClient.post(API_END_POINT.LOGIN, { ...data });
  return response.data;
};

export const logout = async (): Promise<void> => {
  const response = await httpClient.post(API_END_POINT.LOGOUT);
  return response.data;
};

export const refreshToken = async (): Promise<Token> => {
  console.log('Refreshing token at:', new Date().toISOString());
  const response = await httpClient.post(API_END_POINT.REFRESH_TOKEN);
  return response.data;
};
