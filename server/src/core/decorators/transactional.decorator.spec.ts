import { InternalServerErrorException } from '@nestjs/common';
import { Transactional } from './transactional.decorator';
import { ENTITY_MANAGER, TRANSACTION } from '@common/constants';
import { createNamespace } from 'cls-hooked';
import { DataSource } from 'typeorm';

class Test {
  @Transactional()
  test() {
    console.log('Transactional Decorator Test');
  }
}

describe('Transactional Decorator Test', () => {
  it('NameSpace가 존재하지 않을 때', async () => {
    const mock = new Test();

    await expect(mock.test()).rejects.toThrow(
      new InternalServerErrorException(`${TRANSACTION} is not active`)
    );
  });

  it('NameSpace가 존재하지만 active 되지 않은 경우', async () => {
    const mock = new Test();
    createNamespace(TRANSACTION);

    await expect(mock.test()).rejects.toThrow(
      new InternalServerErrorException(`${TRANSACTION} is not active`)
    );
  });

  it('entityManager가 존재하지 않는 경우', async () => {
    const mock = new Test();
    const namespace = createNamespace(TRANSACTION);

    await expect(
      namespace.runPromise(async () => Promise.resolve().then(mock.test))
    ).rejects.toThrow(
      new InternalServerErrorException(`Could not find EntityManager in ${TRANSACTION} namespace`)
    );
  });

  it('entityManager가 존재하는 경우', async () => {
    const mock = new Test();
    const namespace = createNamespace(TRANSACTION);

    const dataSource = await new DataSource({
      type: 'sqlite',
      database: ':memory:',
    }).initialize();

    const entityManager = dataSource.createEntityManager();

    await expect(
      namespace.runPromise(async () => {
        namespace.set(ENTITY_MANAGER, entityManager);
        await Promise.resolve().then(mock.test);
      })
    ).resolves.not.toThrow();
  });
});
