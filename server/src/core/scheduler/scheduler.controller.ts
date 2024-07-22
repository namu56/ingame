import { Cron, CronExpression } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { Controller } from '@nestjs/common';
import { DEFAULT_TIMEZONE } from '@common/utils/date.util';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: DEFAULT_TIMEZONE })
  async updateExpiredMainQuests() {
    await this.schedulerService.updateExpiredMainQuests();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: DEFAULT_TIMEZONE })
  async updateExpiredSubQuests() {
    await this.schedulerService.updateExpiredSubQuests();
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // serviceHealthCheck() {
  //   this.schedulerService.serviceHealthCheck();
  // }
}
