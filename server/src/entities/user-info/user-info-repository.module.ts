import { ClassProvider, Module } from '@nestjs/common';
import { UserInfoRepository } from './user-info.repository';
import { USER_INFO_REPOSITORY_KEY } from './user-info-repository.interface';

export const userInfoRepository: ClassProvider = {
  provide: USER_INFO_REPOSITORY_KEY,
  useClass: UserInfoRepository,
};

@Module({
  providers: [userInfoRepository],
  exports: [userInfoRepository],
})
export class UserInfoRepositoryModule {}
