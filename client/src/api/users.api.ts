import { API_END_POINT } from '@/constant/api';
import { UserProfile } from '@/models/user.model';
import { SignupProps } from '@/pages/SignUp';
import { httpClient } from '@/utils/axios';

export const signup = async (data: Omit<SignupProps, 'confirmPassword'>) => {
  const resposne = await httpClient.post(API_END_POINT.SIGNUP, { ...data });
  return resposne.data;
};

export const patchUserProfile = async (data: UserProfile) => {
  const response = await httpClient.patch(API_END_POINT.PROFILE, { ...data });
  return response.data;
};
