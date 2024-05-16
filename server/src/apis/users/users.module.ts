import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { AuthModule } from '../auth/auth.module';
import { LevelCalculatorModule } from 'src/common/level-calculator/level-calculator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, ProfilePhoto]),
    forwardRef(() => AuthModule),
    LevelCalculatorModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
