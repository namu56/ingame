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

  async save(entity: T | T[]): Promise<T[]> {
    return this.getRepository().save(Array.isArray(entity) ? entity : [entity]);
  }

  async remove(entity: T | T[]): Promise<void> {
    await this.getRepository().remove(Array.isArray(entity) ? entity : [entity]);
  }

  protected getRepository(): Repository<T> {
    return this.transactionManager.getEntityManager().getRepository(this.getName());
  }
}
