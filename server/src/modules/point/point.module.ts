import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from '../../entities/quest/quest.entity';
import { UserInfo } from '../../entities/user-info/user-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quest, UserInfo])],
  providers: [PointService],
  controllers: [PointController],
  exports: [PointService],
})
export class PointModule {}
