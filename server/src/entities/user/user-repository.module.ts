import { ClassProvider, Module } from '@nestjs/common';
import { USER_REPOSITORY_KEY } from './user-repository.interface';
import { UserRepository } from './user.repository';

export const userRepository: ClassProvider = {
  provide: USER_REPOSITORY_KEY,
  useClass: UserRepository,
};

@Module({
  providers: [userRepository],
  exports: [userRepository],
})
export class UserRepositoryModule {}
