import { RootEntity } from '@core/database/generic/root.entity';
import { DataSource, Entity, EntityTarget, FindOneOptions, PrimaryGeneratedColumn } from 'typeorm';
import { GenericTypeOrmRepository } from '../generic-typeorm.repository';
import { TransactionManager } from '../transaction-manager';
import { createNamespace } from 'cls-hooked';
import { ENTITY_MANAGER, TRANSACTION } from '@common/constants';

@Entity()
class Mock extends RootEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
}

class MockRepository extends GenericTypeOrmRepository<Mock> {
  getName(): EntityTarget<Mock> {
    return Mock.name;
  }

  async findById(id: number): Promise<Mock> {
    const findOption: FindOneOptions = { where: { id } };
    return this.getRepository().findOne(findOption);
  }
}

describe('GenericTypeOrm Repository', () => {
  jest.setTimeout(300_000);

  let dataSource: DataSource;
  let mockRepository: MockRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [Mock],
    });
    await dataSource.initialize();

    mockRepository = new MockRepository(new TransactionManager());
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('dataSource 초기화와 mockRepository 생성 확인', () => {
    expect(dataSource).toBeDefined();
    expect(mockRepository).toBeDefined();
  });

  it('save와 delete 정상 작동 확인', async () => {
    const mock = new Mock();
    const namespace = createNamespace(TRANSACTION);

    await namespace.runPromise(async () => {
      await Promise.resolve().then(() =>
        namespace.set(ENTITY_MANAGER, dataSource.createEntityManager())
      );

      // save
      await mockRepository.save(mock);
      const result = await mockRepository.findById(1);
      expect(result).toBeDefined();

      // delete
      await mockRepository.delete(result.id);
      const notExist = await mockRepository.findById(1);
      expect(notExist).toBeNull();
    });
  });
});
