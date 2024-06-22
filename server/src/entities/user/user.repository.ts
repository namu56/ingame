import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { User } from './user.entity';
import { IUserRepository } from './user-repository.interface';
import { EntityTarget } from 'typeorm';

export class UserRepository extends GenericTypeOrmRepository<User> implements IUserRepository {
  getName(): EntityTarget<User> {
    return User.name;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.getRepository().findOneBy({ email });
  }
}
