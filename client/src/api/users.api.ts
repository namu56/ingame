import { API_END_POINT } from '@/constant/api';
import { SignupProps } from '@/pages/SignUp';
import { httpClient } from '@/utils/axios';
import { UserInfo } from '@/models/userInfo.model';

export const signup = async (data: Omit<SignupProps, 'confirmPassword'>) => {
  const resposne = await httpClient.post(API_END_POINT.SIGNUP, { ...data });
  return resposne.data;
};

export const getUserInfo = async (): Promise<UserInfo> => {
  const resposne = await httpClient.get(API_END_POINT.GET_USERINFO);
  return resposne.data;
};
