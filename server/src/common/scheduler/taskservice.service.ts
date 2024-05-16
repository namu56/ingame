import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../../apis/quests/entities/quest.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Mode, Status } from '../../apis/quests/enums/quest.enum';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(@InjectRepository(Quest) private readonly questRepository: Repository<Quest>) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateQuestStatus() {
    const currentDate = new Date();
    const targetQuests = await this.questRepository.find({
      where: { mode: Mode.Sub, status: Status.onProgress },
    });

    if (!targetQuests) {
      this.logger.error('There is no quests to update!');
      return;
    }

    const updatedQuests = targetQuests.map((it) => {
      it.status = Status.Fail;
      it.updatedAt = currentDate;
      return it;
    });

    await this.questRepository.save(updatedQuests);

    this.logger.log(`[${new Date().toISOString()}] Updating quest status success!`);
  }
}
