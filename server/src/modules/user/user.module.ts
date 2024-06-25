import { ClassProvider, Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { UserInfo } from '../../entities/user-info/user-info.entity';
import { ProfilePhoto } from '../../entities/profile-photo/profile-photo.entity';
import { AuthModule } from '../auth/auth.module';
import { USER_SERVICE_KEY } from './interfaces/user-service.interface';
import { UserRepositoryModule } from 'src/entities/user/user-repository.module';
import { UserInfoRepositoryModule } from 'src/entities/user-info/user-info-repository.module';
import { ProfilePhotoRepositoryModule } from 'src/entities/profile-photo/profile-photo-repository.module';

const userService: ClassProvider = {
  provide: USER_SERVICE_KEY,
  useClass: UserService,
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, ProfilePhoto]),
    forwardRef(() => AuthModule),
    UserRepositoryModule,
    UserInfoRepositoryModule,
    ProfilePhotoRepositoryModule,
  ],
  exports: [userService],
  providers: [userService],
  controllers: [UserController],
})
export class UserModule {}
