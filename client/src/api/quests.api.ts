import { CreateSubQuestProps } from '@/components/modals/CreateSubQuestModal';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { API_END_POINT } from '@/constant/api';
import { Quest, SubQuest } from '@/models/quest.model';
import { httpClient } from '@/utils/axios';

interface GetSubQuestParam {
  date: string;
}

export const createMainQuest = async (data: Quest) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};

export const modiMainQuest = async (data: Quest) => {
  const response = await httpClient.patch(API_END_POINT.PATCH_QUEST + `/${data.id}`, { ...data });
  return response.data;
};

export const getSubQuest = async (param: GetSubQuestParam) => {
  const response = await httpClient.get<SubQuest[]>(API_END_POINT.SUB_QUEST, { params: param });
  return response.data;
};

export const modiSubQuest = async (data: SubQuestModifyProps) => {
  const response = await httpClient.patch(API_END_POINT.SUB_QUEST + `/${data.id}`, {
    title: data.title,
    hidden: data.hidden,
  });
  return response.data;
};

export const addSubQuest = async (data: CreateSubQuestProps) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};

export const modiSubQuestStatus = async (data: SubQuestModifyProps) => {
  const response = await httpClient.patch(API_END_POINT.SUB_QUEST + `/${data.id}`, {
    ...data,
  });
  return response.data;
};
