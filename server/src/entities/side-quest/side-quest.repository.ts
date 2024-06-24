import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { ISideQuestRepository } from './side-quest-repository.interface';
import { EntityTarget } from 'typeorm';
import { SideQuest } from './side-quest.entity';

export class sideQuestRepository
  extends GenericTypeOrmRepository<SideQuest>
  implements ISideQuestRepository
{
  getName(): EntityTarget<SideQuest> {
    return SideQuest.name;
  }

  async findByQuestId(questId: number): Promise<SideQuest[]> {
    return this.getRepository().find({ where: { questId } });
  }
}
