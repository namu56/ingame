import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../../entities/quest/quest.entity';
import { Repository } from 'typeorm';
import { Mode, Status } from '../../common/types/quest/quest.type';
import { PointService } from '../../modules/point/point.service';
import { UpdatePointDto } from '../../common/dto/point/update-point.dto';
import { SideQuest } from '../../entities/side-quest/side-quest.entity';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Quest) private readonly questRepository: Repository<Quest>,
    @InjectRepository(SideQuest) private readonly sideQuestRepository: Repository<SideQuest>
  ) {}

  async updateQuestStatus(pointService: PointService) {
    const moveDate = (date: Date, days: number) => {
      const newDate = new Date(date);
      newDate.setHours(newDate.getHours() + 9); // KST 기준으로 변경, UTC일 경우에는 제거
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    };
    const currentDate = new Date();
    const dueDate = moveDate(currentDate, -1);

    const targetQuests = await this.questRepository.find({
      where: {
        mode: Mode.MAIN,
        status: Status.ON_PROGRESS,
        endDate: dueDate.toISOString().split('T')[0],
      },
      relations: ['sideQuests'],
    });
    const targetSubQuests = await this.questRepository.find({
      where: { mode: Mode.SUB, status: Status.ON_PROGRESS },
    });

    if (targetQuests.length === 0) {
      this.logger.error('[main] There is no quests to update!');
      return;
    } else {
      for (const quest of targetQuests) {
        const completedSideQuestsCount = quest.sideQuests.filter(
          (sideQuest) => sideQuest.status === Status.COMPLETED
        ).length;

        if (completedSideQuestsCount > 0) {
          quest.status = Status.COMPLETED;
          quest.updatedAt = currentDate;
        } else {
          quest.status = Status.FAIL;
          quest.updatedAt = currentDate;
        }

        for (const sideQuest of quest.sideQuests) {
          if (sideQuest.status === Status.ON_PROGRESS) {
            sideQuest.status = Status.FAIL;
            sideQuest.updatedAt = currentDate;
          }
        }

        await this.sideQuestRepository.save(quest.sideQuests);
        await this.questRepository.save(quest);

        const updatePointDto = {
          questId: quest.id,
          status: quest.status,
        } satisfies UpdatePointDto;

        await pointService.updatePoint(quest.userId, updatePointDto);
      }
    }

    if (targetSubQuests.length === 0) {
      this.logger.error('[sub] There is no quests to update!');
      return;
    } else {
      const updatedSubQuests = targetSubQuests.map((it) => {
        it.status = Status.FAIL;
        it.updatedAt = currentDate;
        return it;
      });

      await this.questRepository.save(updatedSubQuests);

      for (const quest of updatedSubQuests) {
        const updatePointDto = {
          questId: quest.id,
          status: Status.FAIL,
        } satisfies UpdatePointDto;

        await pointService.updatePoint(quest.userId, updatePointDto);
      }
    }

    this.logger.log(`[${new Date().toISOString()}] Updating quest status success!`);
  }

  serviceHealthCheck() {
    this.logger.log(`Service health OK at ${new Date().toISOString()}`);
  }
}
