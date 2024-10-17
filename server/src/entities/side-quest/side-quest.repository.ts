import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { ISideQuestRepository } from './side-quest-repository.interface';
import { EntityTarget, FindManyOptions, FindOneOptions } from 'typeorm';
import { SideQuest } from './side-quest.entity';

export class SideQuestRepository
  extends GenericTypeOrmRepository<SideQuest>
  implements ISideQuestRepository
{
  getName(): EntityTarget<SideQuest> {
    return SideQuest.name;
  }

  async findById(questId: number, sideQuestId: number): Promise<SideQuest | null> {
    const findOptions: FindOneOptions = { where: { id: sideQuestId, questId } };
    return this.getRepository().findOne(findOptions);
  }

  async findByQuestId(questId: number): Promise<SideQuest[]> {
    const findOptions: FindManyOptions<SideQuest> = { where: { questId } };
    return this.getRepository().find(findOptions);
  }
}
