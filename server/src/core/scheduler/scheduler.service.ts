import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { Status } from '../../common/types/quest/quest.type';
import {
  IPointService,
  POINT_SERVICE_KEY,
} from '@modules/point/interfaces/point-service.interface';
import { UpdatePointRequest } from '@common/requests/point';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
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
          (sideQuest) => sideQuest.status === Status.COMPLETED
        ).length;

        const newStatus = completedSideQuestsCount > 0 ? Status.COMPLETED : Status.FAIL;
        mainQuest.updateStatus(newStatus);

        mainQuest.sideQuests
          .filter((sideQuest) => sideQuest.status === Status.ON_PROGRESS)
          .forEach((sideQuest) => sideQuest.updateStatus(Status.FAIL));

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
        subQuest.updateStatus(Status.FAIL);
        const request = UpdatePointRequest.create(subQuest.id, subQuest.status);
        await this.pointService.updatePoint(subQuest.userId, request);
      }
    } catch (error) {
      throw new HttpException('서브 퀘스트 스케쥴링에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  // async updateQuestStatus() {
  //   const moveDate = (date: Date, days: number) => {
  //     const newDate = new Date(date);
  //     newDate.setHours(newDate.getHours() + 9); // KST 기준으로 변경, UTC일 경우에는 제거
  //     newDate.setDate(newDate.getDate() + days);
  //     return newDate;
  //   };
  //   const currentDate = new Date();
  //   const dueDate = moveDate(currentDate, -1);

  //   const targetQuests = await this.questRepository.find({
  //     where: {
  //       mode: Mode.MAIN,
  //       status: Status.ON_PROGRESS,
  //       endDate: dueDate.toISOString().split('T')[0],
  //     },
  //     relations: ['sideQuests'],
  //   });
  //   const targetSubQuests = await this.questRepository.find({
  //     where: { mode: Mode.SUB, status: Status.ON_PROGRESS },
  //   });

  //   if (targetQuests.length === 0) {
  //     this.logger.error('[main] There is no quests to update!');
  //     return;
  //   } else {
  //     for (const quest of targetQuests) {
  //       const completedSideQuestsCount = quest.sideQuests.filter(
  //         (sideQuest) => sideQuest.status === Status.COMPLETED
  //       ).length;

  //       if (completedSideQuestsCount > 0) {
  //         quest.status = Status.COMPLETED;
  //         quest.updatedAt = currentDate;
  //       } else {
  //         quest.status = Status.FAIL;
  //         quest.updatedAt = currentDate;
  //       }

  //       for (const sideQuest of quest.sideQuests) {
  //         if (sideQuest.status === Status.ON_PROGRESS) {
  //           sideQuest.status = Status.FAIL;
  //           sideQuest.updatedAt = currentDate;
  //         }
  //       }

  //       await this.sideQuestRepository.save(quest.sideQuests);
  //       await this.questRepository.save(quest);

  //       const updatePointRequest = {
  //         questId: quest.id,
  //         status: quest.status,
  //       } satisfies UpdatePointRequest;

  //       await this.pointService.updatePoint(quest.userId, updatePointRequest);
  //     }
  //   }

  //   if (targetSubQuests.length === 0) {
  //     this.logger.error('[sub] There is no quests to update!');
  //     return;
  //   } else {
  //     const updatedSubQuests = targetSubQuests.map((it) => {
  //       it.status = Status.FAIL;
  //       it.updatedAt = currentDate;
  //       return it;
  //     });

  //     await this.questRepository.save(updatedSubQuests);

  //     for (const quest of updatedSubQuests) {
  //       const updatePointRequest = {
  //         questId: quest.id,
  //         status: Status.FAIL,
  //       } satisfies UpdatePointRequest;

  //       await this.pointService.updatePoint(quest.userId, updatePointRequest);
  //     }
  //   }

  //   this.logger.log(`[${new Date().toISOString()}] Updating quest status success!`);
  // }

  // serviceHealthCheck() {
  //   this.logger.log(`Service health OK at ${new Date().toISOString()}`);
  // }
}
