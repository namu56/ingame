import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { Quest } from './quest.entity';

export const QUEST_REPOSITORY_KEY = 'questRepositoryKey';

export interface IQuestRepository extends IGenericRepository<Quest> {
  findMainQuestsByUserId(userId: number, date: string): Promise<Quest[]>;
  findSubQuestsByUserId(userId: number, date: string): Promise<Quest[]>;
  findMainQuestById(id: number, userId: number): Promise<Quest>;
  findSubQuestById(id: number, userId: number): Promise<Quest>;
}
