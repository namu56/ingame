import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { ISideQuestRepository } from './side-quest-repository.interface';
import { EntityTarget, FindOneOptions } from 'typeorm';
import { SideQuest } from './side-quest.entity';

export class SideQuestRepository
  extends GenericTypeOrmRepository<SideQuest>
  implements ISideQuestRepository
{
  getName(): EntityTarget<SideQuest> {
    return SideQuest.name;
  }

  async findById(userId: number, sideQuestId: number): Promise<SideQuest | null> {
    const findOptions: FindOneOptions = { where: { id: sideQuestId, userId } };
    return this.getRepository().findOne(findOptions);
  }

  async findByQuestId(questId: number): Promise<SideQuest[]> {
    return this.getRepository().find({ where: { questId } });
  }
}
