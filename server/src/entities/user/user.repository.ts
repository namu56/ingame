import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { User } from './user.entity';
import { IUserRepository } from './user-repository.interface';
import { EntityTarget } from 'typeorm';

export class UserRepository extends GenericTypeOrmRepository<User> implements IUserRepository {
  getName(): EntityTarget<User> {
    return User.name;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.getRepository().findOneBy({ email });
  }

  async findById(id: number): Promise<User | null> {
    return this.getRepository().findOne({ where: { id } });
  }
}
