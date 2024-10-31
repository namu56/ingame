import { Inject } from '@nestjs/common';
import { IGenericRepository } from '../generic/generic.repository';
import { RootEntity } from '../generic/root.entity';
import { TransactionManager } from 'src/core/database/typeorm/transaction-manager';
import { EntityTarget, Repository } from 'typeorm';

export abstract class GenericTypeOrmRepository<T extends RootEntity>
  implements IGenericRepository<T>
{
  constructor(
    @Inject(TransactionManager) private readonly transactionManager: TransactionManager
  ) {}

  abstract getName(): EntityTarget<T>;

  async save(t: T): Promise<T>;
  async save(t: T[]): Promise<T[]>;
  async save(t: T | T[]): Promise<T | T[]> {
    const savedEntities = await this.getRepository().save(Array.isArray(t) ? t : [t]);
    return Array.isArray(t) ? savedEntities : savedEntities[0];
  }

  async delete(ids: number | number[]): Promise<void> {
    await this.getRepository().delete(ids);
  }

  protected getRepository(): Repository<T> {
    return this.transactionManager.getEntityManager().getRepository(this.getName());
  }
}
