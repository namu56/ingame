import { API_END_POINT } from '@/constant/api';
import { SignupProps } from '@/pages/SignUp';
import { httpClient } from '@/utils/axios';

export const signup = async (data: Omit<SignupProps, 'confirmPassword'>) => {
  const resposne = await httpClient.post(API_END_POINT.SIGNUP, { ...data });
  return resposne.data;
};
