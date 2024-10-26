import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { User } from './user.entity';
import { IUserRepository } from './user-repository.interface';
import { EntityTarget, FindOneOptions } from 'typeorm';
import { USER_SELECT_FIELDS } from '@common/constants';

export class UserRepository extends GenericTypeOrmRepository<User> implements IUserRepository {
  getName(): EntityTarget<User> {
    return User.name;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.getRepository().findOneBy({ email });
  }

  async findUserById(id: number): Promise<User | null> {
    return await this.getRepository()
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userInfo', 'userInfo')
      .leftJoinAndSelect('user.profilePhoto', 'profilePhoto')
      .select(USER_SELECT_FIELDS)
      .where('user.id = :id', { id })
      .getOne();
  }
}
