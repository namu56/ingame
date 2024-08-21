import { InternalServerErrorException } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';
import { ENTITY_MANAGER, TRANSACTION } from '@common/constants';
import { createNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';

describe('Transaction Manager Test', () => {
  it('NameSpace가 없는 경우', () => {
    const manager = new TransactionManager();

    expect(() => manager.getEntityManager()).toThrow(
      new InternalServerErrorException(`${TRANSACTION} is not active`)
    );
  });

  it('NameSpace는 존재하지만, Active가 아닌 경우', () => {
    const manager = new TransactionManager();
    createNamespace(TRANSACTION);

    expect(() => manager.getEntityManager()).toThrow(
      new InternalServerErrorException(`${TRANSACTION} is not active`)
    );
  });

  it('정상적으로 작동하는 경우', async () => {
    const manager = new TransactionManager();
    const namespace = createNamespace(TRANSACTION);

    const dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
    }).initialize();

    const entityManager = dataSource.createEntityManager();

    await namespace.runPromise(async () => {
      namespace.set(ENTITY_MANAGER, entityManager);
      const getEntityManager = manager.getEntityManager();

      expect(getEntityManager).toStrictEqual(entityManager);
    });
  });
});
