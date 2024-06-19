import { RootEntity } from './root.entity';

export interface IGenericRepository<T extends RootEntity> {
  save(t: T | T[]): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  remove(t: T | T[]): Promise<void>;
}
