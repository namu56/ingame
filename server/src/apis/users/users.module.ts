import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInfo, ProfilePhoto])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
