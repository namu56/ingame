import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { Quest } from './quest.entity';

export const QUEST_REPOSITORY_KEY = 'questRepositoryKey';

export interface IQuestRepository extends IGenericRepository<Quest> {
  findMainQuests(userId: number, date: Date): Promise<Quest[]>;
  findSubQuests(userId: number, date: Date): Promise<Quest[]>;
  findMainQuest(userId: number, id: number): Promise<Quest | null>;
  findSubQuest(userId: number, id: number): Promise<Quest | null>;
}
