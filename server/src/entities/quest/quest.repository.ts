import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Quest } from './quest.entity';
import { IQuestRepository } from './quest-repository.interface';
import { EntityTarget, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { Mode } from 'src/common/types/quest/quest.type';
import { QUEST_SELECT_FIELDS } from '@common/constants';
import { plainToInstance } from 'class-transformer';
import { MainQuestResponse } from '@common/responses/quest';
import { SubQuestResponse } from '@common/responses/quest/sub-quest.response';

export class QuestRepository extends GenericTypeOrmRepository<Quest> implements IQuestRepository {
  getName(): EntityTarget<Quest> {
    return Quest.name;
  }

  async findById(id: number): Promise<Quest | null> {
    const findOption: FindOneOptions<Quest> = { where: { id }, relations: ['sideQuests'] };
    return this.getRepository().findOne(findOption);
  }

  async findMainQuests(userId: number, date: Date): Promise<MainQuestResponse[]> {
    const rows = await this.baseSelectQueryBuilder(userId, Mode.MAIN)
      .andWhere('quest.startDate <=:date', { date })
      .andWhere('quest.endDate >= :date', { date })
      .getMany();

    return plainToInstance(MainQuestResponse, rows);
  }
  async findSubQuests(userId: number, date: Date): Promise<SubQuestResponse[]> {
    const rows = await this.baseSelectQueryBuilder(userId, Mode.SUB)
      .andWhere('quest.startDate =:date', { date })
      .getMany();

    return plainToInstance(SubQuestResponse, rows);
  }

  async findMainQuest(id: number, userId: number): Promise<MainQuestResponse | null> {
    const row = await this.baseSelectQueryBuilder(userId, Mode.MAIN)
      .andWhere('quest.id=:id', { id })
      .getOne();
    return plainToInstance(MainQuestResponse, row);
  }

  async findSubQuest(id: number, userId: number): Promise<SubQuestResponse | null> {
    const row = await this.baseSelectQueryBuilder(userId, Mode.SUB)
      .andWhere('quest.id=:id', { id })
      .getOne();
    return plainToInstance(SubQuestResponse, row);
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
