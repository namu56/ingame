import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from '../../apis/quests/entities/quest.entity';
import { SchedulerService } from './taskservice.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Quest]), ScheduleModule.forRoot()],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
