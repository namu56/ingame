import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/user-info.entity';
import { ProfilePhoto } from './entities/profile-photo.entity';
import { AuthModule } from '../auth/auth.module';
import { LevelCalculatorModule } from 'src/common/level-calculator/level-calculator.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserInfo, ProfilePhoto]),
    forwardRef(() => AuthModule),
    LevelCalculatorModule,
    CommonModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
