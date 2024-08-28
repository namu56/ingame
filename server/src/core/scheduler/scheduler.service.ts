import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Status } from '../../common/types/quest/quest.type';
import {
  IPointService,
  POINT_SERVICE_KEY,
} from '@modules/point/interfaces/point-service.interface';
import { UpdatePointRequest } from '@common/requests/point';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import { getUTCMidnightFromKRTime } from '@common/utils/date.util';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(POINT_SERVICE_KEY) private readonly pointService: IPointService
  ) {}

  async updateExpiredMainQuests() {
    try {
      const utcMidnight = getUTCMidnightFromKRTime();
      const mainQuests = await this.questRepository.findExpiredMainQuests(utcMidnight);

      if (!mainQuests || mainQuests.length === 0) {
        this.logger.log('No expired main quests found');
        return;
      }

      for (const mainQuest of mainQuests) {
        const completedSideQuestsCount = mainQuest.sideQuests.filter(
          (sideQuest) => sideQuest.status === Status.Completed
        ).length;

        const newStatus = completedSideQuestsCount > 0 ? Status.Completed : Status.Fail;
        mainQuest.updateStatus(newStatus);

        mainQuest.sideQuests
          .filter((sideQuest) => sideQuest.status === Status.OnProgress)
          .forEach((sideQuest) => sideQuest.updateStatus(Status.Fail));

        const request = UpdatePointRequest.create(mainQuest.id, newStatus);
        await this.pointService.updatePoint(mainQuest.userId, request);
      }
    } catch (error) {
      throw new HttpException('메인 퀘스트 스케쥴링에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async updateExpiredSubQuests() {
    try {
      const utcMidnight = getUTCMidnightFromKRTime();
      const subQuests = await this.questRepository.findExpiredSubQuests(utcMidnight);

      if (!subQuests || subQuests.length === 0) {
        this.logger.log('No expired sub quests found');
        return;
      }

      for (const subQuest of subQuests) {
        subQuest.updateStatus(Status.Fail);
        const request = UpdatePointRequest.create(subQuest.id, subQuest.status);
        await this.pointService.updatePoint(subQuest.userId, request);
      }
    } catch (error) {
      throw new HttpException('서브 퀘스트 스케쥴링에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }
}
