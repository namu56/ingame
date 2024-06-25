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

  async save(entity: T): Promise<T> {
    return this.getRepository().save(entity);
  }

  async delete(id: number): Promise<void> {
    await this.getRepository().delete(id);
  }

  protected getRepository(): Repository<T> {
    return this.transactionManager.getEntityManager().getRepository(this.getName());
  }
}
