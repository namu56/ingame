import { CreateSubQuestProps } from '@/components/modals/CreateSubQuestModal';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { API_END_POINT } from '@/constant/api';
import { Quest, SubQuest, QuestStatus } from '@/models/quest.model';

import { httpClient } from '@/utils/axios';

interface GetSubQuestParam {
  date: string;
}
export interface ModifyQuestStatusProps {
  id: number;
  status: QuestStatus;
}

type CreateQuestData = Omit<Quest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;
type ModifyQuestData = Omit<Quest, 'mode' | 'status' | 'createdAt' | 'updatedAt'>;

export const createMainQuest = async (data: CreateQuestData) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};

export const modiMainQuest = async (data: ModifyQuestData) => {
  const response = await httpClient.patch(API_END_POINT.MAIN_QUEST + `/${data.id}`, { ...data });
  return response.data;
};

export const deleteMainQuest = async (id: number) => {
  const response = await httpClient.delete(API_END_POINT.MAIN_QUEST + `/${id}`);
  return response.data;
}

export const getMainQuest = async () => {
  const response = await httpClient.get<Quest[]>(API_END_POINT.MAIN_QUEST);
  return response.data;
};

export const modiSideQuest = async (param: number) => {
  const response = await httpClient.patch(API_END_POINT.SIDE_QUEST + `/${param}`);
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

export const modiQuestStatus = async (data: ModifyQuestStatusProps) => {
  const response = await httpClient.patch(API_END_POINT.CREATE_QUEST + `/${data.id}`, {
    status: data.status,
  });
  return response.data;
};
