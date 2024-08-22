import { RootEntity } from '@core/database/generic/root.entity';
import { DataSource, Entity, EntityTarget, PrimaryGeneratedColumn } from 'typeorm';
import { GenericTypeOrmRepository } from '../generic-typeorm.repository';
import { TransactionManager } from '../transaction-manager';

@Entity()
class Mock extends RootEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
}

class MockRepository extends GenericTypeOrmRepository<Mock> {
  getName(): EntityTarget<Mock> {
    return Mock.name;
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
});
