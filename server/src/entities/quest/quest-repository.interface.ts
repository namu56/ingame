import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { Quest } from './quest.entity';
import { MainQuestResponse } from '@common/responses/quest';
import { SubQuestResponse } from '@common/responses/quest/sub-quest.response';

export const QUEST_REPOSITORY_KEY = 'questRepositoryKey';

export interface IQuestRepository extends IGenericRepository<Quest> {
  findById(id: number): Promise<Quest>;
  findMainQuests(userId: number, date: Date): Promise<MainQuestResponse[]>;
  findSubQuests(userId: number, date: Date): Promise<SubQuestResponse[]>;
  findMainQuest(id: number, userId: number): Promise<MainQuestResponse | null>;
  findSubQuest(id: number, userId: number): Promise<SubQuestResponse | null>;
}
