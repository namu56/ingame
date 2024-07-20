import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Quest } from './quest.entity';
import { IQuestRepository } from './quest-repository.interface';
import { EntityTarget, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { Mode } from 'src/common/types/quest/quest.type';
import { QUEST_SELECT_FIELDS } from '@common/constants';

export class QuestRepository extends GenericTypeOrmRepository<Quest> implements IQuestRepository {
  getName(): EntityTarget<Quest> {
    return Quest.name;
  }

  async findById(userId: number, questId: number): Promise<Quest | null> {
    const findOptions: FindOneOptions = { where: { id: questId, userId } };
    return this.getRepository().findOne(findOptions);
  }

  async findMainQuests(userId: number, date: Date): Promise<Quest[]> {
    return await this.baseSelectQueryBuilder(userId, Mode.MAIN)
      .andWhere('quest.startDate <=:date', { date })
      .andWhere('quest.endDate >= :date', { date })
      .getMany();
  }
  async findSubQuests(userId: number, date: Date): Promise<Quest[]> {
    return await this.baseSelectQueryBuilder(userId, Mode.SUB)
      .andWhere('quest.startDate =:date', { date })
      .getMany();
  }

  async findMainQuest(userId: number, questId: number): Promise<Quest | null> {
    return await this.baseSelectQueryBuilder(userId, Mode.MAIN)
      .andWhere('quest.id=:id', { id: questId })
      .getOne();
  }

  async findSubQuest(userId: number, questId: number): Promise<Quest | null> {
    return await this.baseSelectQueryBuilder(userId, Mode.SUB)
      .andWhere('quest.id=:id', { id: questId })
      .getOne();
  }

  private baseSelectQueryBuilder(userId: number, mode: Mode): SelectQueryBuilder<Quest> {
    let query = this.getRepository()
      .createQueryBuilder('quest')
      .select(QUEST_SELECT_FIELDS)
      .where('quest.userId = :userId', { userId })
      .andWhere('quest.mode= :mode', { mode });

    if (mode === Mode.MAIN) query = query.leftJoinAndSelect('quest.sideQuests', 'sideQuest');

    return query;
  }
}
