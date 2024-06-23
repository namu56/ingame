import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Quest } from './quest.entity';
import { IQuestRepository } from './quest-repository.interface';
import { EntityTarget, SelectQueryBuilder } from 'typeorm';
import { Mode } from 'src/common/types/quest/quest.type';

export class QuestRepository extends GenericTypeOrmRepository<Quest> implements IQuestRepository {
  getName(): EntityTarget<Quest> {
    return Quest.name;
  }

  async findMainQuestsByUserId(userId: number, dateString: string): Promise<Quest[]> {
    return this.baseSelectQueryBuilder(userId, Mode.Main)
      .leftJoinAndSelect('quest.sideQuests', 'sideQuest')
      .andWhere('quest.startDate <= :dateString', { dateString })
      .andWhere('quest.endDate >= :dateString', { dateString })
      .orderBy('quest.id', 'DESC')
      .getMany();
  }

  async findSubQuestsByUserId(userId: number, dateString: string): Promise<Quest[]> {
    return this.baseSelectQueryBuilder(userId, Mode.Sub)
      .andWhere('quest.startDate = :dateString', { dateString })
      .orderBy('quest.id', 'DESC')
      .getMany();
  }

  async findMainQuestById(id: number, userId: number): Promise<Quest> {
    return this.baseSelectQueryBuilder(userId, Mode.Main).andWhere('qeust.id=:id', { id }).getOne();
  }

  async findSubQuestById(id: number, userId: number): Promise<Quest> {
    return this.baseSelectQueryBuilder(userId, Mode.Sub).andWhere('qeust.id=:id', { id }).getOne();
  }

  private baseSelectQueryBuilder(userId: number, mode: Mode): SelectQueryBuilder<Quest> {
    return this.getRepository()
      .createQueryBuilder('quest')
      .select(this.getSelectFields(mode))
      .where('quest.userId = :userId', { userId })
      .andWhere('quest.mode= :mode', { mode });
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

    return mode === Mode.Main
      ? [...commonFields, 'quest.difficulty', 'quest.startDate', 'quest.endDate']
      : commonFields;
  }
}
