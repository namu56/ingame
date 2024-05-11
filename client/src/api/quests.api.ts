import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { API_END_POINT } from '@/constant/api';
import { SubQuest } from '@/models/quest.model';
import { httpClient } from '@/utils/axios';

interface GetSubQuestParam {
  date: string;
}

export const getSubQuest = async (param: GetSubQuestParam) => {
  const response = await httpClient.get<SubQuest[]>(API_END_POINT.SUB_QUEST, { params: param });
  return response.data;
};

export const modiSubQuest = async (data: SubQuestModifyProps) => {
  const response = await httpClient.patch(API_END_POINT.SUB_QUEST + `/${data.id}`, {
    ...data,
  });
  return response.data;
};
