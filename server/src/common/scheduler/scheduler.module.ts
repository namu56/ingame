import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from '../../apis/quests/entities/quest.entity';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerController } from './scheduler.controller';
import { PointModule } from '../../apis/point/point.module';

@Module({
  imports: [TypeOrmModule.forFeature([Quest]), ScheduleModule.forRoot(), PointModule],
  providers: [SchedulerService],
  controllers: [SchedulerController],
  exports: [SchedulerService],
})
export class SchedulerModule {}
