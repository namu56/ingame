import { Cron, CronExpression } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { Controller, Inject } from '@nestjs/common';
import {
  IPointService,
  POINT_SERVICE_KEY,
} from '@modules/point/interfaces/point-service.interface';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateQuestStatus() {
    await this.schedulerService.updateQuestStatus();
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  serviceHealthCheck() {
    this.schedulerService.serviceHealthCheck();
  }
}
