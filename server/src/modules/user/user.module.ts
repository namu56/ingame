import { ClassProvider, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { USER_SERVICE_KEY } from './interfaces/user-service.interface';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserInfoRepositoryModule } from 'src/entities/user-info/user-info-repository.module';

const userService: ClassProvider = {
  provide: USER_SERVICE_KEY,
  useClass: UserService,
};

@Module({
  imports: [UserRepositoryModule, UserInfoRepositoryModule],
  exports: [userService],
  providers: [userService],
  controllers: [UserController],
})
export class UserModule {}
