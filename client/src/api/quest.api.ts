import { API_END_POINT } from '@/constant/api';
import { httpClient } from '@/utils/axios';
import { Quest } from '@/models/quest.model';

export const CreateQuest = async (data: Quest) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};

export const PatchQuest = async (data: Quest) => {
  const response = await httpClient.patch(`${API_END_POINT.PATCH_QUEST}/${data.id}`, { ...data });
  return response.data;
}