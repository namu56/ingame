import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Status } from '../../common/types/quest/quest.type';
import {
  IPointService,
  POINT_SERVICE_KEY,
} from '@modules/point/interfaces/point-service.interface';
import { UpdatePointRequest } from '@common/requests/point';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import { getExpiredDate } from '@common/utils/date.util';
import { EntityManager } from 'typeorm';
import { Namespace } from '@core/decorators/namespace.decorator';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { SideQuest } from '@entities/side-quest/side-quest.entity';
import { Transactional } from '@core/decorators/transactional.decorator';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository,
    @Inject(POINT_SERVICE_KEY) private readonly pointService: IPointService
  ) {}

  @Namespace()
  @Transactional()
  async updateExpiredMainQuests() {
    try {
      const date = getExpiredDate();
      // 1. 만료된 메인 퀘스트 검색
      const mainQuests = await this.questRepository.findExpiredMainQuests(date);
      console.log(mainQuests);

      if (mainQuests.length === 0) {
        this.logger.log('만료된 메인 퀘스트가 존재하지 않습니다');
        return;
      }

      for (const mainQuest of mainQuests) {
        const sideQuests = await this.sideQuestRepository.findByQuestId(mainQuest.id);

        // 2. 메인 퀘스트의 성공한 사이드 퀘스트의 존재
        const completedSideQuestsCount = sideQuests.filter(
          (sideQuest) => sideQuest.status === Status.Completed
        ).length;

        // 3. 존재하면 상태 Completed, 존재하지 않으면 Fail
        const newStatus = completedSideQuestsCount > 0 ? Status.Completed : Status.Fail;

        // 4. 존재하는 사이드 퀘스트들의 ON_PROGRESS 상태 -> FAIL로 업데이트
        if (sideQuests.length > 0) {
          sideQuests
            .filter((sideQuest) => sideQuest.status === Status.OnProgress)
            .forEach((sideQuest) => sideQuest.updateStatus(Status.Fail));

          // 5. 포인트 업데이트(퀘스트의 상태 업데이트 후 저장)
          // const request = UpdatePointRequest.create(mainQuest.id, newStatus);
          await this.pointService.updatePointForExpiredQuest(mainQuest, newStatus);

          // 6. 업데이트한 사이드 퀘스트들 저장
          for (const sideQuest of sideQuests) {
            await this.sideQuestRepository.save(sideQuest);
          }
        } else {
          // 7. 사이드 퀘스트가 존재하지 않으면, 포인트만 업데이트
          await this.pointService.updatePointForExpiredQuest(mainQuest, newStatus);
        }
      }
    } catch (error) {
      this.logger.warn({ message: '메인 퀘스트 스케쥴링에 실패하였습니다', stack: error.stack });
    }
  }

  async updateExpiredSubQuests() {
    try {
      // const utcMidnight = getUTCMidnightFromKRTime();
      // const subQuests = await this.questRepository.findExpiredSubQuests(utcMidnight);
      // if (!subQuests || subQuests.length === 0) {
      //   this.logger.log('No expired sub quests found');
      //   return;
      // }
      // for (const subQuest of subQuests) {
      //   subQuest.updateStatus(Status.Fail);
      //   const request = UpdatePointRequest.create(subQuest.id, subQuest.status);
      //   await this.pointService.updatePoint(subQuest.userId, request);
      // }
    } catch (error) {
      throw new HttpException('서브 퀘스트 스케쥴링에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }
}
