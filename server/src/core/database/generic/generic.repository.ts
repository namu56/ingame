import { RootEntity } from './root.entity';

export interface IGenericRepository<T extends RootEntity> {
  save(t: T): Promise<T>;
  delete(id: number): Promise<void>;
}
