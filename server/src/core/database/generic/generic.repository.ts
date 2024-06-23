import { RootEntity } from './root.entity';

export interface IGenericRepository<T extends RootEntity> {
  save(t: T | T[]): Promise<T[]>;
  remove(t: T | T[]): Promise<void>;
}
