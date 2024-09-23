import { CreateSubQuestProps } from '@/components/modals/CreateSubQuestModal';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { API_END_POINT } from '@/constant/api';
import { Quest, SubQuest, QuestStatus, MainQuest } from '@/models/quest.model';
import { UpdateMainQuestProps } from '@/pages/EditMainQuest';

import { httpClient } from '@/utils/axios';

interface GetSubQuestParam {
  date: string;
}
export interface ModifyQuestStatusProps {
  id: number;
  status: QuestStatus;
}

type CreateQuestData = Omit<Quest, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

export const createMainQuest = async (data: CreateQuestData) => {
  const response = await httpClient.post(API_END_POINT.CREATE_QUEST, { ...data });
  return response.data;
};

export const modiMainQuest = async (id: number, data: Omit<UpdateMainQuestProps, 'id'>) => {
  const response = await httpClient.patch(API_END_POINT.MAIN_QUEST + `/${id}`, { ...data });
  return response.data;
};

export const deleteMainQuest = async (id: number) => {
  const response = await httpClient.delete(API_END_POINT.MAIN_QUEST + `/${id}`);
  return response.data;
};

export const getMainQuest = async (param: GetSubQuestParam) => {
  const response = await httpClient.get<MainQuest[]>(API_END_POINT.MAIN_QUEST, { params: param });
  return response.data;
};

export const getFindOneMainQuest = async (id: number) => {
  const response = await httpClient.get<MainQuest>(API_END_POINT.MAIN_QUEST + `/${id}`);
  return response.data;
};

export const modiSideQuest = async (questId: number, sideQuestId: number, status: QuestStatus) => {
  const response = await httpClient.patch(`${API_END_POINT.SIDE_QUEST(questId)}/${sideQuestId}`, {
    status,
  });
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

export const delSubQuest = async (id: number) => {
  const response = await httpClient.delete(API_END_POINT.SUB_QUEST + `/${id}`);
  return response.data;
};

export const modiQuestStatus = async (data: ModifyQuestStatusProps) => {
  const response = await httpClient.patch(API_END_POINT.POINT, {
    status: data.status,
    questId: data.id,
  });
  return response.data;
};
