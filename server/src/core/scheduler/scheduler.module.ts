import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from '../../entities/quest/quest.entity';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PointModule } from '../../modules/point/point.module';
import { SideQuest } from '../../entities/side-quest/side-quest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quest, SideQuest]), PointModule],
  providers: [SchedulerService],
  controllers: [SchedulerController],
  exports: [SchedulerService],
})
export class SchedulerModule {}
