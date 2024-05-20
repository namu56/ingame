import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../../apis/quests/entities/quest.entity';
import { Repository } from 'typeorm';
import { Mode, Status } from '../../apis/quests/enums/quest.enum';
import { PointService } from '../../apis/point/point.service';
import { UpdatePointDto } from '../../apis/point/dto/update-point.dto';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(@InjectRepository(Quest) private readonly questRepository: Repository<Quest>) {}

  async updateQuestStatus(pointService: PointService) {
    const currentDate = new Date();
    const targetQuests = await this.questRepository.find({
      where: { mode: Mode.Sub, status: Status.onProgress },
    });

    if (targetQuests.length === 0) {
      this.logger.error('There is no quests to update!');
      return;
    }

    const updatedQuests = targetQuests.map((it) => {
      it.status = Status.Fail;
      it.updatedAt = currentDate;
      return it;
    });

    await this.questRepository.save(updatedQuests);

    for (const quest of updatedQuests) {
      const updatePointDto = {
        questId: quest.id,
        status: Status.Fail,
      } satisfies UpdatePointDto;

      await pointService.updatePoint(quest.userId, updatePointDto);
    }

    this.logger.log(`[${new Date().toISOString()}] Updating quest status success!`);
  }

  serviceHealthCheck() {
    this.logger.log(`Service health OK at ${new Date().toISOString()}`);
  }
}
