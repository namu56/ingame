import { RootEntity } from './root.entity';

export interface GenericRepository<T extends RootEntity> {
  save(t: T | T[]): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  delete(t: T | T[]): Promise<void>;
}
