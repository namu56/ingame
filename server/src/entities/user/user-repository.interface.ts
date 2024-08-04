import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { User } from './user.entity';

export const USER_REPOSITORY_KEY = 'USER_REPOSITORY_KEY';

export interface IUserRepository extends IGenericRepository<User> {
  findById(id: number): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findUserById(id: number): Promise<User | null>;
}
