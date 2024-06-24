import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { SideQuest } from './side-quest.entity';

export const SIDE_QUEST_REPOSITORY_KEY = 'sideQuestRepositoryKey';

export interface ISideQuestRepository extends IGenericRepository<SideQuest> {
  findByQuestId(questId: number): Promise<SideQuest[]>;
}
