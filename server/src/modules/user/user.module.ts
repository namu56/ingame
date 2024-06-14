import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user/user.entity';
import { UserInfo } from '../../entities/user-info/user-info.entity';
import { ProfilePhoto } from '../../entities/profile-photo/profile-photo.entity';
import { AuthModule } from '../auth/auth.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, ProfilePhoto]),
    forwardRef(() => AuthModule),
    CoreModule,
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
