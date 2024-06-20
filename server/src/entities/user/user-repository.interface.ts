import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { User } from './user.entity';

export const USER_REPOSITORY_KEY = 'USER_REPOSITORY_KEY';

export interface IUserRepository extends IGenericRepository<User> {
  findOneByEmail(email: string): Promise<User | null>;
}
