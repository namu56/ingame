import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from '../quests/entities/quest.entity';
import { UserInfo } from '../users/entities/user-info.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Quest, UserInfo])],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService],
})
export class PointModule {}
