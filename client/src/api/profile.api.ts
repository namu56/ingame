import { API_END_POINT } from '@/constant/api';
import { UserProfile } from '@/models/user.model';
import { httpClient } from '@/utils/axios';

export const patchProfile = async (data: UserProfile) => {
  const response = await httpClient.patch(API_END_POINT.PROFILE, data);
  return response.data;
};
