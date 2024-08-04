import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { User } from './user.entity';
import { IUserRepository } from './user-repository.interface';
import { EntityTarget, FindOneOptions } from 'typeorm';

export class UserRepository extends GenericTypeOrmRepository<User> implements IUserRepository {
  getName(): EntityTarget<User> {
    return User.name;
  }

  async findById(id: number): Promise<User> {
    const findOption: FindOneOptions = { where: { id }, relations: ['userInfo', 'profilePhoto'] };
    return this.getRepository().findOne(findOption);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.getRepository().findOneBy({ email });
  }

  async findUserById(id: number): Promise<User | null> {
    const findOption: FindOneOptions = {
      where: { id },
      relations: ['userInfo', 'profilePhoto'],
    };
    return this.getRepository().findOne(findOption);
  }
}
