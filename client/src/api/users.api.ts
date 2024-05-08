import { API_END_POINT } from '@/constant/api';
import { UserProfile } from '@/models/user.model';
import { SignupProps } from '@/pages/SignUp';
import { httpClient } from '@/utils/axios';
import { UserInfo } from '@/models/userInfo.model';

export const signup = async (data: Omit<SignupProps, 'confirmPassword'>) => {
  const response = await httpClient.post(API_END_POINT.SIGNUP, { ...data });
  return response.data;
};

export const patchUserProfile = async (data: UserProfile) => {
  const response = await httpClient.patch(API_END_POINT.PATCH_USERINFO, { ...data });
  return response.data;
};

export const getUserInfo = async (): Promise<UserInfo> => {
  const response = await httpClient.get(API_END_POINT.GET_USERINFO);
  return response.data;
};
