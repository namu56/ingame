import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { PointModule } from '../../modules/point/point.module';
import { QuestRepositoryModule } from '@entities/quest/quest-repository.module';

@Module({
  imports: [QuestRepositoryModule, PointModule],
  providers: [SchedulerService],
  controllers: [SchedulerController],
  exports: [SchedulerService],
})
export class SchedulerModule {}
