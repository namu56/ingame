import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { SideQuest } from './side-quest.entity';

export const SIDE_QUEST_REPOSITORY_KEY = 'sideQuestRepositoryKey';

export interface ISideQuestRepository extends IGenericRepository<SideQuest> {
  findById(questId: number, sideQuestId: number): Promise<SideQuest | null>;
  findByQuestId(questId: number): Promise<SideQuest[]>;
}
