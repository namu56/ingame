import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Quest } from './quest.entity';
import { IQuestRepository } from './quest-repository.interface';
import { EntityTarget, FindOneOptions, SelectQueryBuilder } from 'typeorm';
import { Mode } from 'src/common/types/quest/quest.type';

export class QuestRepository extends GenericTypeOrmRepository<Quest> implements IQuestRepository {
  getName(): EntityTarget<Quest> {
    return Quest.name;
  }

  async findById(id: number): Promise<Quest | null> {
    const findOption: FindOneOptions = { where: { id }, relations: ['sideQuests'] };
    return this.getRepository().findOne(findOption);
  }

  async findMainQuestsByUserId(userId: number, dateString: string): Promise<Quest[]> {
    return this.baseSelectQueryBuilder(userId, Mode.MAIN)
      .andWhere('quest.start <= :dateString', { dateString })
      .andWhere('quest.end >= :dateString', { dateString })
      .orderBy('quest.id', 'DESC')
      .getMany();
  }

  async findSubQuestsByUserId(userId: number, dateString: string): Promise<Quest[]> {
    return this.baseSelectQueryBuilder(userId, Mode.SUB)
      .andWhere('quest.startDate = :dateString', { dateString })
      .orderBy('quest.id', 'DESC')
      .getMany();
  }

  async findMainQuestById(id: number, userId: number): Promise<Quest> {
    return this.baseSelectQueryBuilder(userId, Mode.MAIN).andWhere('qeust.id=:id', { id }).getOne();
  }

  async findSubQuestById(id: number, userId: number): Promise<Quest> {
    return this.baseSelectQueryBuilder(userId, Mode.SUB).andWhere('qeust.id=:id', { id }).getOne();
  }

  private baseSelectQueryBuilder(userId: number, mode: Mode): SelectQueryBuilder<Quest> {
    let query = this.getRepository()
      .createQueryBuilder('quest')
      .select(this.getSelectFields(mode))
      .where('quest.userId = :userId', { userId })
      .andWhere('quest.mode= :mode', { mode });

    if (mode === Mode.MAIN) query = query.leftJoinAndSelect('quest.sideQuests', 'sideQuest');

    return query;
  }

  private getSelectFields(mode: Mode): string[] {
    const commonFields = [
      'quest.id',
      'quest.title',
      'quest.hidden',
      'quest.status',
      'quest.createdAt',
      'quest.updatedAt',
    ];

    return mode === Mode.MAIN
      ? [...commonFields, 'quest.difficulty', 'quest.startDate', 'quest.endDate']
      : commonFields;
  }
}
