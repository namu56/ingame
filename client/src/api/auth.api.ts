import { API_END_POINT } from '@/constant/api';
import { LoginProps } from '@/pages/Login';
import { queryClient } from '@/provider/queryProvider';
import { httpClient } from '@/utils/axios';

interface Token {
  accessToken: string;
}

export const login = async (data: LoginProps): Promise<Token> => {
  const response = await httpClient.post(API_END_POINT.LOGIN, { ...data });
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await httpClient.post(API_END_POINT.LOGOUT);
  } finally {
    queryClient.clear();
  }
};

export const refreshToken = async (): Promise<Token> => {
  const response = await httpClient.post(API_END_POINT.REFRESH_TOKEN);
  return response.data;
};
