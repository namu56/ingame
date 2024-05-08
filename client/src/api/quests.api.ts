import { API_END_POINT } from '@/constant/api';
import { SubQuest } from '@/models/quest.model';
import { httpClient } from '@/utils/axios';

interface GetSubQuestParam {
  date: string;
}

export const getSubQuest = async (param: GetSubQuestParam) => {
  const response = await httpClient.get<SubQuest[]>(API_END_POINT.GET_SUB_QUEST, { params: param });
  return response.data;
};
