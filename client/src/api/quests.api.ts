import { CreateSubQuestProps } from '@/components/modals/CreateSubQuestModal';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { API_END_POINT } from '@/constant/api';
import { Quest, SubQuest, getQuest } from '@/models/quest.model';
import { httpClient } from '@/utils/axios';

interface GetSubQuestParam {
  date: string;
}

export const getMainQuest = async () => {
  const response = await httpClient.get<getQuest[]>(API_END_POINT.MAIN_QUEST);
  return response.data;
}

export const createMainQuest = async (data: Quest) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};

export const modiMainQuest = async (data: Quest) => {
  const response = await httpClient.patch(API_END_POINT.MAIN_QUEST + `/${data.id}`, { ...data });
  return response.data;
};

export const modiSideQuest = async (param: number) => {
  const response = await httpClient.patch(API_END_POINT.SIDE_QUEST + `/${param}`);
  console.log(response.data);
  return response.data;
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

export const addSubQuest = async (data: CreateSubQuestProps) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};
